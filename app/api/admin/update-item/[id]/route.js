import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const itemId = params.id;
  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description") || null;
  const url = formData.get("url") || null;
  const imageUrl = formData.get("imageUrl") || null;
  const sourceType = formData.get("sourceType");

  await prisma.item.update({
    where: { id: itemId },
    data: {
      name,
      description,
      url,
      imageUrl,
      sourceType,
    },
  });

  return Response.redirect(`${process.env.NEXTAUTH_URL}/admin/items`, 303);
}
