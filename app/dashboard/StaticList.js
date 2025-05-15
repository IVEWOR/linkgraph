"use client";

import Link from "next/link";
import Image from "next/image";

export default function StaticList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((entry) => {
        const { item, id, customName, customDesc, customUrl } = entry;
        const title = customName || item.name;
        const subtitle = customDesc || item.description;

        return (
          <div
            key={id}
            className="bg-white rounded-xl shadow flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              {/* placeholder drag handle */}
              <div className="w-4 h-4 bg-gray-200 rounded cursor-grab" />

              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={title}
                  width={48}
                  height={48}
                  className="rounded-lg bg-gray-100 object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
              )}

              <div>
                <p className="font-medium">{title}</p>
                {subtitle && (
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {customUrl && (
                <a
                  href={customUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit
                </a>
              )}
              {/* static “more” indicator */}
              <div className="text-gray-400">⋮</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
