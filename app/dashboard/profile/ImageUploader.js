"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageUploader({ initialImage }) {
  const [imageUrl, setImageUrl] = useState(initialImage || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    const res = await fetch("/api/dashboard/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Profile"
          width={300}
          height={300}
          className="w-24 h-24 rounded-full object-cover"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm"
      />

      {uploading && <p>Uploading...</p>}

      {/* Hidden field to submit */}
      <input type="hidden" name="image" value={imageUrl} />
    </div>
  );
}
