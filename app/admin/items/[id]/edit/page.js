import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";

export default async function EditItemPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "ADMIN") {
    return <div className="p-8 text-center">Access Denied</div>;
  }

  const item = await prisma.item.findUnique({
    where: { id: id },
  });

  if (!item) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      <form
        action={`/api/admin/update-item/${item.id}`}
        method="POST"
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          defaultValue={item.name}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          defaultValue={item.description || ""}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="url"
          defaultValue={item.url || ""}
          placeholder="URL"
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="imageUrl"
          defaultValue={item.imageUrl || ""}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
        />
        <select
          name="sourceType"
          defaultValue={item.sourceType}
          className="w-full border p-2 rounded"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="AI_SCRAPE">AI_SCRAPE</option>
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
