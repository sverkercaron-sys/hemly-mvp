"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  url: string | null;
  read_at: string | null;
  created_at: string;
}

export function NotificationsPanel() {
  const locale = useLocale();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) {
      setError(pick(locale, { sv: "Kunde inte hämta notiser", ar: "تعذر تحميل الإشعارات", fi: "Ilmoitusten haku epäonnistui", bcs: "Neuspjelo učitavanje obavijesti", en: "Could not fetch notifications" }));
      return;
    }
    const data = await res.json();
    setItems(data.notifications ?? []);
  }, [locale]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    load();
  }

  if (error) return <p className="card p-4 text-sm text-rose-700">{error}</p>;
  if (!items.length) {
    return <p className="card p-4 text-sm text-slate-600">{pick(locale, { sv: "Inga notiser ännu.", ar: "لا توجد إشعارات بعد.", fi: "Ei ilmoituksia vielä.", bcs: "Još nema obavijesti.", en: "No notifications yet." })}</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article key={item.id} className={`card p-4 text-sm ${item.read_at ? "opacity-70" : ""}`}>
          <p className="font-semibold text-[#1d1d1f]">{item.title}</p>
          <p className="text-[var(--muted)]">{item.body}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{new Date(item.created_at).toLocaleString("sv-SE")}</p>
          <div className="mt-3 flex gap-2">
            {item.url ? (
              <Link href={item.url} className="button-secondary" onClick={() => markRead(item.id)}>
                {pick(locale, { sv: "Öppna bostad", ar: "فتح العقار", fi: "Avaa kohde", bcs: "Otvori nekretninu", en: "Open listing" })}
              </Link>
            ) : null}
            {!item.read_at ? (
              <button className="button-secondary" onClick={() => markRead(item.id)}>
                {pick(locale, { sv: "Markera som läst", ar: "وضع كمقروء", fi: "Merkitse luetuksi", bcs: "Označi kao pročitano", en: "Mark as read" })}
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
