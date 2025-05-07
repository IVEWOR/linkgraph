import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      inventory: {
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });

  // 1. If user not found
  if (!user) return notFound();

  // 2. If user is on FREE plan, redirect or show upgrade page
  if (user.plan !== "PRO") {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">{user.name || username}</h1>
        <p className="text-gray-600 mb-4">This profile is private.</p>
        <Link href="/" className="text-blue-600 underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || username}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name || username}</h1>
          <p className="text-gray-600 text-sm">@{username}</p>
        </div>
      </div>

      {/* Inventory Display */}
      <h2 className="text-xl font-semibold mb-4">Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.inventory?.items?.map((i) => {
          const displayName = i.customName || i.item.name;
          const displayDesc = i.customDesc || i.item.description;
          const displayUrl = i.customUrl || i.item.url;
          const displayImage = i.item.imageUrl;

          return (
            <div
              key={i.id}
              className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                {displayImage && (
                  <Image
                    src={displayImage}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                )}
                <h3 className="text-lg font-medium">{displayName}</h3>
              </div>
              {displayDesc && (
                <p className="text-gray-600 text-sm">{displayDesc}</p>
              )}
              {displayUrl && (
                <a
                  href={displayUrl}
                  className="text-blue-600 text-sm underline"
                  target="_blank"
                >
                  {displayUrl}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
