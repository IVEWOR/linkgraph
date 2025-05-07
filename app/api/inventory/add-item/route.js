import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, imageUrl, url } = await req.json();

  // 1. Check if item already exists (by name + URL maybe)
  let item = await prisma.item.findFirst({
    where: {
      name,
      url,
    },
  });

  // 2. If not, create new item (sourceType = USER)
  if (!item) {
    item = await prisma.item.create({
      data: {
        name,
        description,
        imageUrl,
        url,
        sourceType: "USER",
      },
    });
  }

  // 3. Add it to user's inventory
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { inventory: true },
  });

  await prisma.itemOnInventory.create({
    data: {
      inventoryId: user.inventory.id,
      itemId: item.id,
      customName: name,
      customDesc: description,
      customUrl: url,
    },
  });

  return Response.json({ success: true });
}
