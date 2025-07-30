import { getAllUsers } from "@/lib/actions/get-users";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const users = await getAllUsers();

  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Active Orders</h2>
          <p className="text-2xl font-bold text-blue-600">45</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Reports</h2>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
      </div>

      {/* User List */}
      <div className="bg-black rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Avatar</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Button */}
      <form
        action="/api/auth/logout"
        method="POST"
        className="mt-6 text-center"
      >
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md shadow-sm transition"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
