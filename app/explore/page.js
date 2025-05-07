import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Explore Creators",
};

export default async function ExplorePage() {
  const users = await prisma.user.findMany({
    where: { plan: "PRO" },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🌟 Explore Creators</h1>

      {users.length === 0 && (
        <p className="text-gray-600">No public profiles yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/${user.username}`}
            className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex items-center gap-3 mb-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || user.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
              )}
              <div>
                <p className="font-semibold text-lg">
                  {user.name || user.username}
                </p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
            <p className="text-sm text-blue-600">View Profile →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
