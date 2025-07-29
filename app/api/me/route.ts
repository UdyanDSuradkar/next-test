//E:\Projects\next-test\app\api\me\route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const result = await db.query(
      "SELECT name, email, avatar_url FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = result.rows[0];
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
