// app/[username]/page.js

import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      inventory: {
        include: {
          items: { include: { item: true } },
        },
      },
    },
  });
  if (!user) return notFound();
  if (user.plan !== "PRO") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile is Private</h1>
          <p className="mt-2 text-gray-600">
            Upgrade to PRO to view this profile.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-600 underline">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ── Left Sidebar ── */}
          <aside className="md:w-1/3">
            <div className="sticky top-20 bg-white p-6 rounded-xl shadow">
              {user.image && (
                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={user.image}
                    alt={user.name || username}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold text-center">
                {user.name || username}
              </h1>
              <p className="text-gray-500 text-center mb-4">@{username}</p>
              {user.bio && (
                <p className="text-gray-700 text-sm mb-4">{user.bio}</p>
              )}
              {Array.isArray(user.socialLinks) &&
                user.socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {user.socialLinks.map((link, i) => {
                      const Icon = platformIcons[link.platform] || FaGlobe;
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          target="_blank"
                          className="flex items-center gap-1 px-3 py-1 border rounded-full text-sm hover:bg-gray-100"
                        >
                          <Icon size={16} className="text-black" />
                          <span>{link.platform}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          </aside>

          {/* ── Right Content ── */}
          <section className="md:w-2/3">
            <div>
              {/* <h2 className="text-2xl font-semibold mb-6">Inventory</h2> */}
              {user.inventory?.items?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user.inventory.items.map((entry) => {
                    const { item } = entry;
                    const title = entry.customName || item.name;
                    const desc = entry.customDesc || item.description;
                    const url = entry.customUrl || item.url;

                    return (
                      <div
                        key={entry.id}
                        className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <div className="w-20 h-20 overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center">
                              <Image
                                src={item.imageUrl}
                                alt={title}
                                width={60}
                                height={60}
                                className="object-cover rounded-xl"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded" />
                          )}
                          <div>
                            <h3 className="text-lg font-medium">{title}</h3>
                            {desc && (
                              <p className="text-gray-600 text-sm">{desc}</p>
                            )}
                          </div>
                        </div>
                        {url && (
                          <>
                            <Link
                              href={url}
                              target="_blank"
                              className="inline-block absolute top-0 left-0 right-0 bottom-0"
                            >
                              <span className="sr-only">Learn More</span>
                            </Link>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No items yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
