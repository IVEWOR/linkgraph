import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // Delete all inventory links first
  await prisma.itemOnInventory.deleteMany({
    where: { id },
  });

  // Then delete the item itself
  await prisma.item.delete({
    where: { id: id },
  });

  return Response.redirect(`${process.env.NEXTAUTH_URL}/admin/item`, 303);
}
