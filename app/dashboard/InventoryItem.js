"use client";

import { useState } from "react";

export default function InventoryItem({
  item,
  itemOnInventoryId,
  customName,
  customDesc,
  customUrl,
  refresh,
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: customName || item.name,
    description: customDesc || item.description || "",
    url: customUrl || item.url || "",
  });

  const handleSave = async () => {
    const res = await fetch(`/api/inventory/item/${itemOnInventoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      console.log("Updated!");
      setEditing(false);
      refresh();
    } else {
      console.error("Failed to update item");
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/inventory/item/${itemOnInventoryId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      refresh();
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-2">
      {editing ? (
        <>
          <input
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-white bg-green-600 px-3 py-1 rounded"
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-600">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium text-lg">{form.name}</p>
          {form.description ? (
            <p className="text-gray-600 text-sm">{form.description}</p>
          ) : item.description ? (
            <p className="text-gray-600 text-sm">{item.description}</p>
          ) : null}
          {form.url ? (
            <a
              href={form.url}
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              {form.url}
            </a>
          ) : item.url ? (
            <a
              href={item.url}
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              {item.url}
            </a>
          ) : null}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)} className="text-blue-600">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-600">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
