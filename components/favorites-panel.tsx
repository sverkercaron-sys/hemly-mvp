"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatSEK } from "@/lib/utils";

interface FavoriteRow {
  id: string;
  property_id: string;
  properties: { slug: string; title: string; price: number };
}

export function FavoritesPanel() {
  const [items, setItems] = useState<FavoriteRow[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch favorites");
        return res.json();
      })
      .then((data) => setItems(data.favorites ?? []))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="card p-4 text-sm text-rose-700">{error}</p>;
  if (!items.length) return <p className="card p-4 text-sm text-slate-600">No favorites yet.</p>;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article key={item.id} className="card flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">{item.properties.title}</p>
            <p className="text-sm text-slate-600">{formatSEK(item.properties.price)}</p>
          </div>
          <Link href={`/bostad/${item.properties.slug}`} className="button-secondary">
            Open
          </Link>
        </article>
      ))}
    </div>
  );
}
