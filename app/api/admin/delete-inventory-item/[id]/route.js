import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const inventoryItemId = params.id;

  await prisma.itemOnInventory.delete({
    where: { id: inventoryItemId },
  });

  return Response.redirect(`${process.env.NEXTAUTH_URL}/admin/inventory`, 303);
}
