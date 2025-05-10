import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import SocialLinksForm from "./SocialLinksForm";
// import ImagePicker from "./ImagePicker";
import ImageUploader from "./ImageUploader";

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="p-8 text-center">Please log in to view this page.</div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

      <form
        action="/api/dashboard/update-profile"
        method="POST"
        className="space-y-4"
      >
        <ImageUploader initialImage={user.image || ""} />

        <input
          type="text"
          name="name"
          defaultValue={user.name || ""}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="username"
          defaultValue={user.username || ""}
          placeholder="Username"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          maxLength="300"
          defaultValue={user.bio || ""}
          placeholder="Tell us about yourself (max 300 chars)"
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="image"
          defaultValue={user.image || ""}
          placeholder="Profile Image URL"
          className="w-full border p-2 rounded"
        />
        <SocialLinksForm
          initialLinks={
            user.socialLinks && Array.isArray(user.socialLinks)
              ? user.socialLinks
              : []
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
