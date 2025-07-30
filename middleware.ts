// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Protect routes
const protectedRoutes = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value;

    // Don't try to decode it — just check presence
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Only run middleware on these paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
