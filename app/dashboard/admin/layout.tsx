import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/jwt";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const user = verifyJWT(token);

  if (!user || user.role !== "admin") redirect("/unauthorized");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black-800 text-white p-4">
        {/* Sidebar nav here */}
      </aside>
      <main className="flex-1 bg-black-50 p-6">{children}</main>
    </div>
  );
}
