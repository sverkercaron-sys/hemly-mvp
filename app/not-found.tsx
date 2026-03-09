import { getServerLocale, pick } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getServerLocale();
  return (
    <section className="card p-8 text-center">
      <h1 className="text-3xl font-bold">{pick(locale, { sv: "Hittades inte", ar: "غير موجود", fi: "Ei löytynyt", bcs: "Nije pronađeno", en: "Not found" })}</h1>
      <p className="mt-2 text-slate-600">{pick(locale, { sv: "Sidan eller bostaden finns inte.", ar: "الصفحة أو العقار غير موجود.", fi: "Sivua tai kohdetta ei löytynyt.", bcs: "Stranica ili nekretnina ne postoji.", en: "The page or property does not exist." })}</p>
    </section>
  );
}
