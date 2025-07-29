// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const existing = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  const result = await db.query(
    `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email`,
    [email, passwordHash, name]
  );

  const token = generateJWT(result.rows[0]);

  const res = NextResponse.json({ message: "User registered" });
  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    path: "/",
  });

  return res;
}
