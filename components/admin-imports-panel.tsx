"use client";

import { useEffect, useState } from "react";

interface ListingImport {
  id: string;
  source: string;
  external_id: string;
  imported_at: string;
}

export function AdminImportsPanel() {
  const [items, setItems] = useState<ListingImport[]>([]);

  useEffect(() => {
    fetch("/api/listing-imports")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ imports: [] })))
      .then((data) => setItems(data.imports ?? []));
  }, []);

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Latest listing imports</h2>
      {items.map((item) => (
        <article key={item.id} className="card p-3 text-sm">
          <p className="font-semibold">{item.source}</p>
          <p className="text-slate-600">External ID: {item.external_id}</p>
          <p className="text-slate-600">{new Date(item.imported_at).toLocaleString("sv-SE")}</p>
        </article>
      ))}
      {items.length === 0 ? <p className="card p-4 text-sm text-slate-600">No imports yet.</p> : null}
    </section>
  );
}
