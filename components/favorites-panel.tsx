"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatSEK } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

interface FavoriteRow {
  id: string;
  property_id: string;
  properties: { slug: string; title: string; price: number };
}

export function FavoritesPanel() {
  const [items, setItems] = useState<FavoriteRow[]>([]);
  const [error, setError] = useState<string>("");
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => {
        if (!res.ok) throw new Error(pick(locale, { sv: "Kunde inte hämta favoriter", ar: "تعذر تحميل المفضلة", fi: "Suosikkien haku epäonnistui", bcs: "Neuspjelo učitavanje favorita", en: "Could not fetch favorites" }));
        return res.json();
      })
      .then((data) => setItems(data.favorites ?? []))
      .catch((err) => setError(err.message));
  }, [locale]);

  if (error) return <p className="card p-4 text-sm text-rose-700">{error}</p>;
  if (!items.length) return <p className="card p-4 text-sm text-slate-600">{pick(locale, { sv: "Inga favoriter än.", ar: "لا توجد مفضلات بعد.", fi: "Ei suosikkeja vielä.", bcs: "Još nema favorita.", en: "No favorites yet." })}</p>;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article key={item.id} className="card flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">{item.properties.title}</p>
            <p className="text-sm text-slate-600">{formatSEK(item.properties.price)}</p>
          </div>
          <Link href={`/bostad/${item.properties.slug}`} className="button-secondary">
            {pick(locale, { sv: "Öppna", ar: "فتح", fi: "Avaa", bcs: "Otvori", en: "Open" })}
          </Link>
        </article>
      ))}
    </div>
  );
}
