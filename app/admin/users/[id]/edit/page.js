import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "ADMIN") {
    return <div className="p-8 text-center">Access Denied</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>

      <form
        action={`/api/admin/update-user/${user.id}`}
        method="POST"
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          defaultValue={user.name || ""}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="username"
          defaultValue={user.username || ""}
          placeholder="Username"
          className="w-full border p-2 rounded"
        />
        <select
          name="role"
          defaultValue={user.role}
          className="w-full border p-2 rounded"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select
          name="plan"
          defaultValue={user.plan}
          className="w-full border p-2 rounded"
        >
          <option value="FREE">FREE</option>
          <option value="PRO">PRO</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
