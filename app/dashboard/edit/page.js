// app/dashboard/edit/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import EditProfile from "./EditProfile";
import { redirect } from "next/navigation";

export default async function EditPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  // fetch user + inventory ordered by `order`
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      inventory: {
        include: {
          items: {
            orderBy: { order: "asc" },
            include: { item: true },
          },
        },
      },
    },
  });

  return <EditProfile user={user} />;
}
