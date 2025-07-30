// types/next-auth.d.ts
import NextAuth from "next-auth";
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "user"; // <-- Role added
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: "admin" | "user"; // Optional role on User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    role?: "admin" | "user"; // Role in JWT as well
  }
}
