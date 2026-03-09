"use client";

import { useEffect, useState } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

interface ListingImport {
  id: string;
  source: string;
  external_id: string;
  imported_at: string;
}

export function AdminImportsPanel() {
  const [items, setItems] = useState<ListingImport[]>([]);
  const locale = useLocale();
  const formatLocale = locale === "ar" ? "ar" : locale === "fi" ? "fi-FI" : locale === "bcs" ? "bs-BA" : locale === "en" ? "en-GB" : "sv-SE";

  useEffect(() => {
    fetch("/api/listing-imports")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ imports: [] })))
      .then((data) => setItems(data.imports ?? []));
  }, []);

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">
        {pick(locale, { sv: "Senaste importerna", ar: "أحدث الاستيرادات", fi: "Uusimmat tuonnit", bcs: "Najnoviji importi", en: "Latest listing imports" })}
      </h2>
      {items.map((item) => (
        <article key={item.id} className="card p-3 text-sm">
          <p className="font-semibold">{item.source}</p>
          <p className="text-slate-600">
            {pick(locale, { sv: "Externt ID", ar: "المعرف الخارجي", fi: "Ulkoinen ID", bcs: "Eksterni ID", en: "External ID" })}: {item.external_id}
          </p>
          <p className="text-slate-600">{new Date(item.imported_at).toLocaleString(formatLocale)}</p>
        </article>
      ))}
      {items.length === 0 ? (
        <p className="card p-4 text-sm text-slate-600">
          {pick(locale, { sv: "Inga importer ännu.", ar: "لا توجد استيرادات بعد.", fi: "Ei tuonteja vielä.", bcs: "Još nema importa.", en: "No imports yet." })}
        </p>
      ) : null}
    </section>
  );
}
