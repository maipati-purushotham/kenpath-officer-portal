import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { log } from "./logger";

export const SESSION_COOKIE_NAME = "officer_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds

// ⚠️ REPLACE with your hash from Step 3.2
const DEMO_PASSWORD_HASH =
  "$2b$10$wRGlezw86ueNczmMFpF8nuHyasC5IJYAgZ3L5syOmZgxOQyLVKhv.";
const USERS: Record<string, string> = {
  officer: DEMO_PASSWORD_HASH,
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET missing or too short. Add a 32+ char secret to .env.example",
    );
  }
  return secret;
}

// ---------- Password check ----------
export function validateCredentials(
  username: string,
  password: string,
): boolean {
  const hash = USERS[username];
  if (!hash) return false;

  try {
    return bcrypt.compareSync(password, hash);
  } catch (err) {
    log("error", "bcrypt_compare_failed", { err: String(err) });
    return false;
  }
}

// ---------- Session token (HMAC-signed) ----------
export function createSessionToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

export function verifySessionToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [b64, hmac] = parts;
    const payload = Buffer.from(b64, "base64url").toString();
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");

    // constant-time compare
    const hmacBuf = Buffer.from(hmac);
    const expectedBuf = Buffer.from(expected);
    if (hmacBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return null;

    const [username] = payload.split(":");
    return username || null;
  } catch {
    return null;
  }
}

// ---------- Get current session ----------
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
