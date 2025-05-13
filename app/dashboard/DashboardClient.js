"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DashboardClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "", url: "" });

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const withOrder = reordered.map((it, idx) => ({ ...it, order: idx }));
    setItems(withOrder);
    await fetch("/api/inventory/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: withOrder }),
    });
  };

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
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/inventory/item/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <AddItemButton />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="inventory"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 mt-4"
            >
              {items.map((entry, idx) => {
                const { item, id, customName, customDesc, customUrl } = entry;
                const title = customName || item.name;
                const subtitle = customDesc || item.description;
                return (
                  <Draggable key={id} draggableId={id} index={idx}>
                    {(p) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        className="bg-white rounded-xl shadow flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            {...p.dragHandleProps}
                            className="cursor-grab text-gray-300"
                          >
                            <FaGripVertical size={18} />
                          </span>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-gray-400 hover:text-gray-600">
                                <FiMoreVertical size={20} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => openEdit(entry)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => deleteItem(id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
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
