// lib/jwt.ts

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export type UserPayload = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

// Sign a JWT with 7-day expiration
export function signJWT(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT and return decoded user payload
export function verifyJWT(token: string): UserPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
