import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { LoginSchema } from "@/lib/types";
import { log } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(`login:${ip}`, 5, 60_000);
  if (!rl.ok) {
    log("warn", "login_rate_limited", { ip });
    return NextResponse.json(
      {
        error: "చాలా ప్రయత్నాలు. దయచేసి ఒక నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.",
      },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // ✅ Trim to avoid trailing-space bugs
  const username = parsed.data.username.trim();
  const password = parsed.data.password.trim();

  // Authenticate
  if (!validateCredentials(username, password)) {
    log("warn", "login_failed", { username, ip });
    return NextResponse.json(
      { error: "యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ తప్పు" },
      { status: 401 },
    );
  }

  // Create session
  const token = createSessionToken(username);
  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  log("info", "login_success", { username, ip });
  return res;
}
