// components/EditProfile.jsx
"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ImageUploader from "@/app/dashboard/profile/ImageUploader";
import SocialLinksForm from "@/app/dashboard/profile/SocialLinksForm";

export default function EditProfile({ user }) {
  // form state
  const [form, setForm] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    image: user.image || "",
    socialLinks: user.socialLinks || [],
  });

  // inventory state
  const [items, setItems] = useState(
    user.inventory.items.map((entry) => ({
      id: entry.id,
      title: entry.customName || entry.item.name,
      desc: entry.customDesc || entry.item.description,
      url: entry.customUrl || entry.item.url,
      img: entry.item.imageUrl,
      order: entry.order,
    }))
  );

  // handle form changes
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    // reassign order
    setItems(reordered.map((it, i) => ({ ...it, order: i })));
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      socialLinks: form.socialLinks,
      items: items.map(({ id, order }) => ({ id, order })),
    };
    await fetch("/api/dashboard/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    alert("Saved!");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-8 p-6 bg-gray-50">
      {/* Preview */}
      <div className="lg:w-1/3 sticky top-20 self-start bg-white p-6 rounded-xl shadow">
        <div className="text-center mb-6">
          {form.image && (
            <img
              src={form.image}
              alt=""
              className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
            />
          )}
          <h2 className="text-2xl font-bold">{form.name || "Your Name"}</h2>
          <p className="text-gray-500">@{form.username || "username"}</p>
        </div>
        {form.bio && <p className="text-gray-700 text-sm mb-4">{form.bio}</p>}
        {Array.isArray(form.socialLinks) && (
          <div className="flex flex-wrap justify-center gap-2">
            {form.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                className="flex items-center gap-1 px-3 py-1 border rounded-full text-sm hover:bg-gray-100"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
        <h3 className="mt-6 mb-2 font-semibold">Inventory Order</h3>
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.id} className="truncate">
              • {it.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:w-2/3 bg-white p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={onChange("name")}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={onChange("username")}
            className="border p-2 rounded"
          />
        </div>
        <textarea
          placeholder="Bio (max 300 chars)"
          maxLength={300}
          value={form.bio}
          onChange={onChange("bio")}
          className="w-full border p-2 rounded"
        />
        <div>
          <label className="block mb-2 font-medium">Profile Image</label>
          <ImageUploader
            initialImage={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Social Links</label>
          <SocialLinksForm
            initialLinks={form.socialLinks}
            onChange={(links) => setForm({ ...form, socialLinks: links })}
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Reorder Inventory</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="inventory">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {items.map((it, idx) => (
                    <Draggable key={it.id} draggableId={it.id} index={idx}>
                      {(p) => (
                        <li
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className="p-3 bg-gray-100 rounded flex items-center gap-3"
                        >
                          {it.img && (
                            <img
                              src={it.img}
                              alt=""
                              className="w-10 h-10 rounded"
                            />
                          )}
                          <span>{it.title}</span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save All
        </button>
      </form>
    </div>
  );
}
