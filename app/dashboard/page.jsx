import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import AddItemButton from "@/app/dashboard/AddItemButton";
import InventoryList from "./InventoryList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-8">
        <p className="text-xl">Please log in to access your dashboard.</p>
        <Link href="/api/auth/signin" className="underline text-blue-600">
          Sign In
        </Link>
      </div>
    );
  }

  const userId = session.user.id;

  const inventory = await prisma.inventory.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user.name || session.user.email}
      </h1>

      <h2 className="text-xl font-semibold mb-2">Your Inventory</h2>
      {user.plan === "FREE" && (
        <Link
          href="/api/stripe/create-checkout-session"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mt-4"
        >
          Upgrade to PRO for $19/month
        </Link>
      )}
      <AddItemButton />

      <InventoryList inventory={inventory} />
    </div>
  );
}
