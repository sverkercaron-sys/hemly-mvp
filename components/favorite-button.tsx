"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const locale = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ favorites: [] })))
      .then((data) => {
        const has = (data.favorites ?? []).some((row: { property_id?: string }) => row.property_id === propertyId);
        setIsFavorite(has);
      });
  }, [propertyId]);

  async function toggle() {
    setBusy(true);
    if (isFavorite) {
      await fetch(`/api/favorites?property_id=${propertyId}`, { method: "DELETE" });
      setIsFavorite(false);
      setBusy(false);
      return;
    }

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ property_id: propertyId })
    });

    if (res.ok) {
      setIsFavorite(true);
      setBusy(false);
      return;
    }

    if (res.status === 401) window.location.href = "/auth";
    setBusy(false);
  }

  return (
    <button type="button" className="button-secondary" onClick={toggle} disabled={busy}>
      {isFavorite
        ? pick(locale, { sv: "Sparad i favoriter", ar: "محفوظ في المفضلة", fi: "Tallennettu suosikkeihin", bcs: "Sačuvano u favoritima", en: "Saved to favorites" })
        : pick(locale, { sv: "Spara i favoriter", ar: "احفظ في المفضلة", fi: "Tallenna suosikkeihin", bcs: "Sačuvaj u favorite", en: "Save to favorites" })}
    </button>
  );
}

