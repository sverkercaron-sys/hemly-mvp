"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

interface PendingProperty {
  id: string;
  title: string;
  city: string;
  status: "pending" | "approved" | "rejected";
}

export function AdminModerationPanel() {
  const [items, setItems] = useState<PendingProperty[]>([]);
  const locale = useLocale();

  async function load() {
    const res = await fetch("/api/properties?status=pending");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.properties ?? []);
  }

  async function decide(propertyId: string, status: "approved" | "rejected") {
    await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, status })
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article key={item.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-slate-600">{item.city}</p>
          </div>
          <div className="flex gap-2">
            <button className="button-primary" onClick={() => decide(item.id, "approved")}>
              {pick(locale, { sv: "Godkänn", ar: "قبول", fi: "Hyväksy", bcs: "Odobri", en: "Approve" })}
            </button>
            <button className="button-secondary" onClick={() => decide(item.id, "rejected")}>
              {pick(locale, { sv: "Avvisa", ar: "رفض", fi: "Hylkää", bcs: "Odbij", en: "Reject" })}
            </button>
          </div>
        </article>
      ))}
      {items.length === 0 ? (
        <p className="card p-4 text-sm text-slate-600">
          {pick(locale, { sv: "Inga väntande annonser.", ar: "لا توجد إعلانات قيد الانتظار.", fi: "Ei odottavia ilmoituksia.", bcs: "Nema oglasa na čekanju.", en: "No pending listings." })}
        </p>
      ) : null}
    </div>
  );
}
