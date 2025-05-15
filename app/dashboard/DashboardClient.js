"use client";

import { useState } from "react";
import InventoryReorderList from "./InventoryReorderList";
import AddItemButton from "./AddItemButton";

export default function DashboardClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);

  return (
    <>
      <div className="flex justify-end mb-4">
        <AddItemButton
          onAdd={(newItem) => setItems((prev) => [...prev, newItem])}
        />
      </div>

      {items.length > 0 ? (
        <InventoryReorderList
          items={items}
          onReorder={(newItems) => setItems(newItems)}
          onUpdate={(updated) =>
            setItems((prev) =>
              prev.map((it) => (it.id === updated.id ? updated : it))
            )
          }
          onDelete={(id) =>
            setItems((prev) => prev.filter((it) => it.id !== id))
          }
        />
      ) : (
        <p className="text-gray-500">No items in your inventory yet.</p>
      )}
    </>
  );
}
