import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaGlobe,
} from "react-icons/fa";

const platformIcons = {
  GitHub: FaGithub,
  Twitter: FaTwitter,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  Facebook: FaFacebook,
  TikTok: FaTiktok,
  Website: FaGlobe,
};

export default async function ExplorePage() {
  const users = await prisma.user.findMany({
    where: { plan: "PRO" },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      socialLinks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Explore Creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/${user.username}`}
              className="block rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition"
            >
              <div className="relative h-76 w-full">
                <Image
                  src={user.image || "/placeholder.jpg"}
                  alt={user.name || user.username}
                  fill
                  className="object-cover"
                />
                {/* dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* name & username */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-xl font-semibold leading-tight">
                    {user.name || user.username}
                  </h2>
                  <p className="text-sm opacity-90 mb-2">@{user.username}</p>
                  {/* social icons */}
                  <div className="flex space-x-2">
                    {Array.isArray(user.socialLinks) &&
                      user.socialLinks.slice(0, 3).map((link, i) => {
                        const Icon = platformIcons[link.platform] || FaGlobe;
                        return (
                          <Icon
                            key={i}
                            size={20}
                            className="text-white drop-shadow"
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
