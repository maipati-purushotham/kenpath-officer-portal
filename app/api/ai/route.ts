import { NextRequest, NextResponse } from "next/server";
import { AIRequestSchema } from "@/lib/types";
import { applications } from "@/lib/data";
import { analyzeApplication } from "@/lib/ai-service";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Auth check (defense in depth — middleware also does this)
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 AI calls per minute per user
  const rl = rateLimit(`ai:${username}`, 10, 60_000);
  if (!rl.ok) {
    log("warn", "ai_rate_limited", { username });
    return NextResponse.json(
      {
        error: "చాలా అభ్యర్థనలు. దయచేసి ఒక నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.",
      },
      { status: 429 },
    );
  }

  // Parse and validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AIRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Find application
  const app = applications.find((a) => a.id === parsed.data.applicationId);
  if (!app) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  // Call AI
  try {
    const result = await analyzeApplication(app);
    log("info", "ai_analysis_success", {
      username,
      applicationId: app.id,
      decision: result.suggestedDecision,
      confidence: result.confidence,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    log("error", "ai_analysis_failed", { username, error: message });
    return NextResponse.json(
      {
        error: "AI విశ్లేషణ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
