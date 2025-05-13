import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const inventory = await prisma.inventory.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { item: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>
          <p className="text-gray-600">Your Inventory</p>
        </div>
      </div>

      {/* Pass data into the client component */}
      <DashboardClient initialItems={inventory?.items || []} />
    </div>
  );
}
