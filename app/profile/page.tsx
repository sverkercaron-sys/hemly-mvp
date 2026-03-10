import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileSettingsPanel } from "@/components/profile-settings-panel";
import { SearchProfilesPanel } from "@/components/search-profiles-panel";
import { getAuthContext } from "@/lib/auth";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function ProfilePage() {
  const { user } = await getAuthContext();
  if (!user) redirect("/auth");

  const locale = await getServerLocale();

  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Profil", ar: "الملف", fi: "Profiili", bcs: "Profil", en: "Profile" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Mina inställningar", ar: "إعداداتي", fi: "Asetukseni", bcs: "Moje postavke", en: "My settings" })}</h1>
      </div>

      <ProfileSettingsPanel />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#1d1d1f]">{pick(locale, { sv: "Sökprofil", ar: "ملف البحث", fi: "Hakuprofiili", bcs: "Profil pretrage", en: "Search profile" })}</h2>
        <SearchProfilesPanel />
      </div>

      <div className="card p-4 text-sm text-[var(--muted)]">
        <p>{pick(locale, { sv: "Tips: Spara en standardsökprofil så laddas filtren automatiskt på bostadssidan.", ar: "نصيحة: احفظ ملف بحث افتراضيًا لتعبئة الفلاتر تلقائيًا.", fi: "Vinkki: Tallenna oletushakuprofiili, niin suodattimet täyttyvät automaattisesti.", bcs: "Savjet: Sačuvaj podrazumijevani profil pretrage za automatske filtere.", en: "Tip: Save a default search profile and filters will auto-fill on listings." })}</p>
        <Link href="/search-profiles" className="mt-2 inline-flex font-semibold text-[#1d1d1f] underline">
          {pick(locale, { sv: "Gå till sökprofiler", ar: "اذهب إلى ملفات البحث", fi: "Siirry hakuprofiileihin", bcs: "Idi na profile pretrage", en: "Go to search profiles" })}
        </Link>
      </div>
    </section>
  );
}
