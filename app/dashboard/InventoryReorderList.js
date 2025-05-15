"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { FaGripVertical } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import AddItemButton from "./AddItemButton";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Single sortable entry
function SortableItem({ entry, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: entry.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = entry.customName || entry.item.name;
  const subtitle = entry.customDesc || entry.item.description;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-4">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-300"
        >
          <FaGripVertical size={18} />
        </span>

        {entry.item.imageUrl ? (
          <Image
            src={entry.item.imageUrl}
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
            <p className="text-sm text-gray-500 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {entry.customUrl && (
          <a
            href={entry.customUrl}
            target="_blank"
            className="text-blue-600 hover:underline text-sm"
          >
            Visit
          </a>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600">
              <FiMoreVertical size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onEdit(entry)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(entry.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function InventoryReorderList({
  items: initialItems = [],
  onReorder,
  onUpdate,
  onDelete,
}) {
  const [items, setItems] = useState(initialItems);
  const [dndKey, setDndKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "", url: "" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reorder on drag end
  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
        ...it,
        order: idx,
      }));
      setItems(newItems);

      // persist order
      await fetch("/api/inventory/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });
    }
  };

  // Edit flow
  const openEdit = (entry) => {
    setEditing(entry);
    setForm({
      name: entry.customName || entry.item.name,
      desc: entry.customDesc || entry.item.description || "",
      url: entry.customUrl || entry.item.url || "",
    });
  };
  const saveEdit = async () => {
    await fetch(`/api/inventory/item/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.desc,
        url: form.url,
      }),
    });
    setItems((prev) =>
      prev.map((it) =>
        it.id === editing.id
          ? {
              ...it,
              customName: form.name,
              customDesc: form.desc,
              customUrl: form.url,
            }
          : it
      )
    );
    setEditing(null);
    setDndKey((k) => k + 1);
  };

  // Delete flow
  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/inventory/item/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== id));
    setDndKey((k) => k + 1);
  };

  return (
    <>
      {/* Add Item button */}
      <div className="flex justify-end mb-4">
        <AddItemButton />
      </div>

      {/* DnD list */}
      <DndContext
        key={dndKey}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((entry) => (
              <SortableItem
                key={entry.id}
                entry={entry}
                onEdit={openEdit}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update title, description, or link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.desc}
                onChange={(e) =>
                  setForm((f) => ({ ...f, desc: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </div>
            <Button className="w-full" onClick={saveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
