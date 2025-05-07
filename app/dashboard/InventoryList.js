"use client";
import { useRouter } from "next/navigation";
import InventoryItem from "./InventoryItem";

export default function InventoryList({ inventory }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 gap-4">
      {inventory?.items?.length > 0 ? (
        inventory.items.map((i) => (
          <InventoryItem
            key={i.id}
            item={i.item}
            itemOnInventoryId={i.id}
            customName={i.customName}
            customDesc={i.customDesc}
            customUrl={i.customUrl}
            refresh={() => router.refresh()} // or location.reload()
          />
        ))
      ) : (
        <p>No items in your inventory yet.</p>
      )}
    </div>
  );
}
