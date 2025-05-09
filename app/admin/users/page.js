import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteButton from "./DeleteButton";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600">You do not have admin privileges.</p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Go back to homepage
        </Link>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">👤 All Users</h1>

      <div className="overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Plan</th>
              <th>Role</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name || "-"}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.plan}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="text-center px-2 py-2">
                  <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="text-blue-600 underline mr-4"
                  >
                    Edit
                  </Link>
                  <DeleteButton userId={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
