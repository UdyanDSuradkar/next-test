// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, generateJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user || !user.password_hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateJWT({ id: user.id, email: user.email });

  const res = NextResponse.json({ message: "Logged in" });
  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
