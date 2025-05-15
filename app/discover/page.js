// app/discover/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiscoverPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userURL, setUserURL] = useState();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a name or URL.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to discover");
      } else {
        setUserURL(`/${data.username}`);
        // router.push(`/${data.username}`);
      }
    } catch (e) {
      console.error(e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Discover a Creator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Enter creator name or Twitter/YouTube URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}
        {userURL && (
          <Link href={userURL} target="_blank">
            Check Profile
          </Link>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Discovering…" : "Discover"}
        </Button>
      </form>
    </div>
  );
}
