import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { items } = await req.json(); // [{ id, order }, ...]

  // Only update the authenticated user's inventory
  await Promise.all(
    items.map(({ id, order }) =>
      prisma.itemOnInventory.update({
        where: { id },
        data: { order },
      })
    )
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
