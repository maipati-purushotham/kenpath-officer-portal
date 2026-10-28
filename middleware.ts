import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "officer_session";

const PROTECTED_PATHS = [
  "/dashboard",
  "/application",
  "/api/ai",
  "/api/decisions",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/application/:path*",
    "/api/ai/:path*",
    "/api/decisions/:path*",
  ],
};
