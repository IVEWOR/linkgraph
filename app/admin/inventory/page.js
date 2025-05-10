import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AdminInventoryPage() {
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

  const inventories = await prisma.inventory.findMany({
    include: {
      user: true,
      items: {
        include: {
          item: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🗃️ User Inventories</h1>

      {inventories.map((inventory) => (
        <div
          key={inventory.id}
          className="mb-8 border p-4 rounded-xl shadow-sm bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">
            {inventory.user.name || inventory.user.email} (
            {inventory.user.username})
          </h2>

          {inventory.items.length > 0 ? (
            <table className="w-full text-sm border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th>Description</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.items.map((itemEntry) => (
                  <tr key={itemEntry.id} className="border-t">
                    <td className="px-4 py-2">
                      {itemEntry.customName || itemEntry.item.name}
                    </td>
                    <td>
                      {itemEntry.customDesc ||
                        itemEntry.item.description ||
                        "-"}
                    </td>
                    <td className="text-blue-600 underline truncate max-w-[180px]">
                      {itemEntry.customUrl || itemEntry.item.url || "-"}
                    </td>
                    <td>
                      <form
                        action={`/api/admin/delete-inventory-item/${itemEntry.id}`}
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-2">No items in this inventory.</p>
          )}
        </div>
      ))}
    </div>
  );
}
