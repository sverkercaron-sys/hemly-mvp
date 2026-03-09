import { getServerLocale, pick } from "@/lib/i18n";

export default async function Loading() {
  const locale = await getServerLocale();

  return (
    <div className="card p-6 text-sm text-slate-500">
      {pick(locale, { sv: "Laddar Hemly...", ar: "جارٍ تحميل Hemly...", fi: "Ladataan Hemlyä...", bcs: "Učitavanje Hemly...", en: "Loading Hemly..." })}
    </div>
  );
}
