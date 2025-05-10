"use client";

import Image from "next/image";
import { useState } from "react";

const presetImages = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

export default function ImagePicker({ initialImage }) {
  const [selectedImage, setSelectedImage] = useState(initialImage || "");

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {presetImages.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setSelectedImage(url)}
            className={`border rounded p-1 ${
              selectedImage === url ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <Image
              src={url}
              alt="Avatar"
              width={300}
              height={300}
              className="w-12 h-12 rounded-full"
            />
          </button>
        ))}
      </div>

      <input
        type="url"
        placeholder="Or enter your own image URL"
        value={selectedImage}
        onChange={(e) => setSelectedImage(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Hidden field to submit */}
      <input type="hidden" name="image" value={selectedImage} />
    </div>
  );
}
