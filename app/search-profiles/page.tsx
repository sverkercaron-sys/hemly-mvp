import { SearchProfilesPanel } from "@/components/search-profiles-panel";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function SearchProfilesPage() {
  const locale = await getServerLocale();
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Bevakning", ar: "التنبيهات", fi: "Ilmoitukset", bcs: "Obavještenja", en: "Alerts" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Sökprofiler", ar: "ملفات البحث", fi: "Hakuprofiilit", bcs: "Profili pretrage", en: "Search alerts" })}</h1>
      </div>
      <SearchProfilesPanel />
    </section>
  );
}
