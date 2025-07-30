import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/jwt";
import Image from "next/image";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user: {
    name?: string;
    email: string;
    avatar?: string;
    authMethod?: string;
  } | null = null;

  try {
    if (token) {
      // ✅ Handle custom JWT login
      const decoded = verifyJWT(token);
      if (!decoded?.email) redirect("/login");

      user = {
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.avatar,
        authMethod: decoded.authMethod || "Email/Password",
      };
    } else {
      // ✅ Handle NextAuth login (Google/GitHub)
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) redirect("/login");

      user = {
        name: session.user.name || "",
        email: session.user.email,
        avatar: session.user.image || "/default-avatar.png",
        authMethod: "OAuth (Google/GitHub)",
      };
    }
  } catch (err) {
    console.error("❌ Token/session verification failed:", err);
    redirect("/login");
  }

  return (
    <DashboardLayout title={`Welcome back, ${user?.name || "User"} 👋`}>
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full border shadow"
        />
        <div className="text-center">
          <p className="text-lg font-semibold">{user?.email}</p>
          <p className="text-sm text-gray-500">{user?.authMethod}</p>
        </div>

        <form
          action="/api/user/update"
          method="POST"
          className="w-full space-y-4"
        >
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Update Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user?.name || ""}
              className="w-full px-4 py-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              defaultValue={user?.avatar || ""}
              className="w-full px-4 py-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
          >
            Save Changes
          </button>
        </form>

        <form action="/api/auth/logout" method="POST" className="w-full">
          <button
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-all"
            type="submit"
          >
            Logout
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
