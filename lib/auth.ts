// lib/auth.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function generateJWT(user: { id: string; email: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
