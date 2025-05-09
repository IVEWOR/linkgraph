import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminItemsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Go back to homepage
        </Link>
      </div>
    );
  }

  // Fetch items and see who added them through the inventory link
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      ItemOnInventory: {
        include: {
          inventory: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 All Items</h1>

      <div className="overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th>Description</th>
              <th>URL</th>
              <th>Source</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const addedBy =
                item.sourceType === "USER"
                  ? item.ItemOnInventory?.[0]?.inventory?.user
                  : null;

              return (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td>{item.description?.slice(0, 40) || "-"}</td>
                  <td className="text-blue-600 underline max-w-[180px] truncate">
                    {item.url || "-"}
                  </td>
                  <td>{item.sourceType}</td>
                  <td>
                    {addedBy ? (
                      <Link
                        className="text-blue-600 underline"
                        href={`/${addedBy.username}`}
                      >
                        {addedBy.name || addedBy.username}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="text-blue-600 underline mr-3"
                    >
                      Edit
                    </Link>
                    <form
                      action={`/api/admin/delete-item/${item.id}`}
                      method="POST"
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
