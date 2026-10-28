import { GoogleGenAI } from "@google/genai";
import { Application, AIResult, AIResponseSchema } from "./types";
import { log } from "./logger";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_key_here") {
    throw new Error("GEMINI_API_KEY not configured in .env.local");
  }
  return new GoogleGenAI({ apiKey: key });
}

// Exponential backoff retry helper
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);

      // Only retry on 503 / UNAVAILABLE / high demand
      const isRetryable =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("high demand");

      if (!isRetryable || attempt === maxRetries) {
        throw err;
      }

      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      log("warn", "ai_retry", {
        attempt: attempt + 1,
        delayMs: Math.round(delay),
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export async function analyzeApplication(app: Application): Promise<AIResult> {
  const ai = getClient();

  const prompt = `You are an AI assistant to a Telangana Revenue Department officer.
Analyze this land record application and respond ONLY in Telugu (except IDs/numbers).

Application data:
${JSON.stringify(app, null, 2)}

Rules:
- Summary should be 2-3 sentences in Telugu
- List missing documents in Telugu
- List any inconsistencies in Telugu (e.g., name spelling, survey number mismatch)
- suggestedDecision must be exactly one of: "approve", "reject", "return"
- reasonsTe should be 2-3 reasons in Telugu
- confidence must be exactly one of: "high", "medium", "low"

Return ONLY valid JSON with these exact fields:
{
  "summaryTe": "string",
  "missingDocuments": ["string"],
  "inconsistencies": ["string"],
  "suggestedDecision": "approve" | "reject" | "return",
  "reasonsTe": "string",
  "confidence": "high" | "medium" | "low"
}`;

  // Wrap the AI call with retry logic
  const response = await withRetry(async () => {
    return await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
  });

  const text = response.text;

  // Check if response text is empty/undefined to satisfy TypeScript
  if (!text) {
    log("error", "ai_empty_response");
    throw new Error("AI returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    log("error", "ai_invalid_json", { raw: text.slice(0, 300) });
    throw new Error("AI returned invalid JSON");
  }

  const validated = AIResponseSchema.safeParse(parsed);
  if (!validated.success) {
    log("error", "ai_schema_mismatch", {
      issues: validated.error.issues,
    });
    throw new Error("AI response did not match expected schema");
  }

  return validated.data;
}
