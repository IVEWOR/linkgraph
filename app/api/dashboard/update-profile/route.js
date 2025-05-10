import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name");
  const username = formData.get("username");
  const bio = formData.get("bio");
  const image = formData.get("image");
  const socialLinksRaw = formData.get("socialLinks");

  let socialLinks;
  try {
    socialLinks = JSON.parse(socialLinksRaw);
  } catch (error) {
    socialLinks = {};
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      username,
      bio,
      image,
      socialLinks,
    },
  });

  return Response.redirect(
    `${process.env.NEXTAUTH_URL}/dashboard/profile`,
    303
  );
}
