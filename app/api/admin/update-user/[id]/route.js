import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name") || null;
  const username = formData.get("username") || null;
  const role = formData.get("role");
  const plan = formData.get("plan");

  await prisma.user.update({
    where: { id: params.id },
    data: {
      name,
      username,
      role,
      plan,
    },
  });

  return Response.redirect(`${process.env.NEXTAUTH_URL}/admin/users`, 303);
}
