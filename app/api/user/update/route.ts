// app/api/user/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/db"; // 🔁 Adjust if using Supabase client or another DB

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = verifyJWT(token);

    if (!user || !user.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const avatar = formData.get("avatar")?.toString().trim();

    if (!name && !avatar) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Dynamically build query and values
    const fields: string[] = [];
    const values: any[] = [];

    if (name) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(name);
    }
    if (avatar) {
      fields.push(`avatar = $${fields.length + 1}`);
      values.push(avatar);
    }

    values.push(user.id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${
      values.length
    }`;

    await db.query(query, values);

    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  } catch (err) {
    console.error("❌ Failed to update user:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
