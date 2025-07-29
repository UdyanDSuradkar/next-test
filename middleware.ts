// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Define protected routes
const protectedRoutes = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const user = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role?: string;
      };

      // Allow request to proceed
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);
      if (user.role) requestHeaders.set("x-user-role", user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      console.error("JWT error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Enable middleware only for selected paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
