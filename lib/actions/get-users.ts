// lib/actions/get-users.ts
import { db } from "@/lib/db";

export async function getAllUsers() {
  const result = await db.query(`
    SELECT id, name, email, avatar, role
    FROM users
  `);

  return result.rows;
}
