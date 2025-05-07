import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const { name, description, url } = await req.json();

  await prisma.itemOnInventory.update({
    where: { id },
    data: {
      customName: name,
      customDesc: description,
      customUrl: url,
    },
  });

  return new Response("Updated", { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;

  await prisma.itemOnInventory.delete({
    where: { id },
  });

  return new Response("Deleted", { status: 200 });
}
