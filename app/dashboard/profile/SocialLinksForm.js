"use client";

import { useState } from "react";

const platforms = [
  "X",
  "LinkedIn",
  "GitHub",
  "Instagram",
  "YouTube",
  "Facebook",
  "TikTok",
  "Website",
];

export default function SocialLinksForm({ initialLinks }) {
  const [links, setLinks] = useState(initialLinks || []);

  const addLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const updateLink = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select
            value={link.platform}
            onChange={(e) => updateLink(index, "platform", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="">Select Platform</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <input
            type="url"
            placeholder="URL (https://...)"
            value={link.url}
            onChange={(e) => updateLink(index, "url", e.target.value)}
            className="w-2/3 border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="text-red-600"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLink}
        className="text-blue-600 underline mt-2"
      >
        + Add Social Link
      </button>

      {/* Hidden field to submit as JSON */}
      <input type="hidden" name="socialLinks" value={JSON.stringify(links)} />
    </div>
  );
}
