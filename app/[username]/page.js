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

  // 1) Try to load an authenticated User
  let entity = await prisma.user.findUnique({
    where: { username },
    include: {
      inventory: {
        include: {
          items: { include: { item: true } },
        },
      },
    },
  });

  let isUser = true;

  // 2) Fallback to Profile if no User
  if (!entity) {
    entity = await prisma.profile.findUnique({
      where: { username },
      include: {
        inventory: {
          include: {
            items: { include: { item: true } },
          },
        },
      },
    });
    isUser = false;
  }

  if (!entity) return notFound();

  // 3) If it's a FREE user, block per your existing logic
  if (isUser && entity.plan !== "PRO") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
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

  // 4) Render the shared UI
  const {
    name,
    image,
    bio,
    socialLinks,
    inventory: { items },
  } = entity;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ── Left Sidebar ── */}
          <aside className="md:w-1/3">
            <div className="sticky top-20 bg-white p-6 rounded-xl shadow">
              {image && (
                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={image}
                    alt={name || username}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold text-center">
                {name || username}
              </h1>
              <p className="text-gray-500 text-center mb-4">@{username}</p>
              {bio && <p className="text-gray-700 text-sm mb-4">{bio}</p>}
              {Array.isArray(socialLinks) && socialLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {socialLinks.map((link, i) => {
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
            <h2 className="text-2xl font-semibold mb-6">Inventory</h2>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((entry) => {
                  const { item, customName, customDesc, customUrl } = entry;
                  const title = customName || item.name;
                  const desc = customDesc || item.description;
                  const url = customUrl || item.url;

                  return (
                    <Link
                      key={entry.id}
                      href={url || "#"}
                      target={url ? "_blank" : undefined}
                      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {item.imageUrl ? (
                            <div className="w-16 h-16 overflow-hidden rounded-xl bg-gray-100">
                              <Image
                                src={item.imageUrl}
                                alt={title}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                          )}
                          <h3 className="text-lg font-medium">{title}</h3>
                        </div>
                        {desc && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {desc}
                          </p>
                        )}
                        {url && (
                          <span className="inline-block text-white bg-blue-600 hover:bg-blue-700 text-center w-full py-2 rounded">
                            Visit Link
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No items yet.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
