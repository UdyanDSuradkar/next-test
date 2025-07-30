// lib/actions/user.ts
import { db } from "@/lib/db";

export async function getOrCreateOAuthUser(user: {
  name: string;
  email: string;
  avatar: string;
  provider: string;
}) {
  try {
    // 1. Check if the user already exists
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [user.email]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // 2. Insert a new user
    const created = await db.query(
      `INSERT INTO users (name, email, avatar, auth_method, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user.name, user.email, user.avatar, user.provider, "user"]
    );

    return created.rows[0];
  } catch (error) {
    console.error("❌ Failed to get or create OAuth user:", error);
    throw new Error("Database error");
  }
}
