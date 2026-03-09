import { FavoritesPanel } from "@/components/favorites-panel";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function FavoritesPage() {
  const locale = await getServerLocale();
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Sparat", ar: "المحفوظ", fi: "Tallennettu", bcs: "Sačuvano", en: "Saved" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Favoriter", ar: "المفضلة", fi: "Suosikit", bcs: "Favoriti", en: "Favorites" })}</h1>
      </div>
      <FavoritesPanel />
    </section>
  );
}
