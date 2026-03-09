import Link from "next/link";
import { ArrowRight, Calculator, Home, MapPinned } from "lucide-react";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function HomePage() {
  const locale = await getServerLocale();

  const actions = [
    {
      href: "/bostader",
      title: pick(locale, { sv: "Sök bostäder", ar: "ابحث عن منزل", fi: "Etsi koti", bcs: "Pretraži domove", en: "Search homes" }),
      description: pick(locale, {
        sv: "Filtrera på stad, område, storlek, rum, pris eller månadskostnad.",
        ar: "رشّح حسب المدينة والمنطقة والمساحة والغرف والسعر أو التكلفة الشهرية.",
        fi: "Suodata kaupungin, alueen, koon, huoneiden, hinnan tai kuukausikulun mukaan.",
        bcs: "Filtriraj po gradu, području, veličini, sobama, cijeni ili mjesečnom trošku.",
        en: "Filter by city, area, size, rooms, price or monthly cost."
      }),
      icon: Home
    },
    {
      href: "/affordability",
      title: pick(locale, { sv: "Boendekalkyl", ar: "القدرة الشرائية", fi: "Budjetti", bcs: "Pristupačnost", en: "Affordability" }),
      description: pick(locale, {
        sv: "Förstå din köpkraft i tre enkla steg.",
        ar: "افهم قدرتك الشرائية في ثلاث خطوات بسيطة.",
        fi: "Ymmärrä ostovoimasi kolmessa vaiheessa.",
        bcs: "Shvati svoju kupovnu moć u tri jednostavna koraka.",
        en: "Understand purchasing power in three simple steps."
      }),
      icon: Calculator
    },
    {
      href: "/map",
      title: pick(locale, { sv: "Kartvy", ar: "عرض الخريطة", fi: "Karttanäkymä", bcs: "Pregled mape", en: "Map discovery" }),
      description: pick(locale, {
        sv: "Skanna områden visuellt med klustrade prisnivåer.",
        ar: "استعرض الأحياء بصريًا مع تجميع نقاط الأسعار.",
        fi: "Tutki alueita visuaalisesti klusteroiduilla hintapisteillä.",
        bcs: "Pregledaj kvartove vizuelno uz grupisane cijene.",
        en: "Scan neighborhoods visually with clustered price points."
      }),
      icon: MapPinned
    }
  ];

  return (
    <section className="space-y-8">
      <div className="soft-panel overflow-hidden p-7 sm:p-12">
        <div className="max-w-4xl space-y-6">
          <span className="eyebrow-chip">Hemly Marketplace</span>
          <h1 className="section-title text-4xl sm:text-6xl">
            {pick(locale, {
              sv: "Hitta hem. Enkelt.",
              ar: "اعثر على منزلك. ببساطة.",
              fi: "Löydä koti. Selkeästi.",
              bcs: "Pronađi dom. Jednostavno.",
              en: "Find home. Clearly."
            })}
          </h1>
          <p className="max-w-3xl text-base text-[var(--muted)] sm:text-xl">
            {pick(locale, {
              sv: "En premium bostadsmarknadsplats med modern sökning, boendekalkyl, kartutforskning och modererade annonser.",
              ar: "منصة عقارية متميزة تجمع البحث الحديث وحساب القدرة الشرائية واستكشاف الخريطة والإعلانات المراجعة.",
              fi: "Premium-asuntomarkkinapaikka modernilla haulla, budjettinäkymällä, kartalla ja moderoidulla sisällöllä.",
              bcs: "Premium platforma za nekretnine sa modernom pretragom, kalkulatorom pristupačnosti, mapom i moderacijom oglasa.",
              en: "A premium property marketplace with modern search, monthly affordability insights, map exploration, and trusted listing moderation."
            })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/bostader" className="button-primary px-6 py-3">
              {pick(locale, { sv: "Utforska bostäder", ar: "استعرض المنازل", fi: "Selaa koteja", bcs: "Istraži nekretnine", en: "Explore Listings" })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/affordability" className="button-secondary px-6 py-3">
              {pick(locale, { sv: "Starta kalkyl", ar: "ابدأ الحساب", fi: "Aloita laskelma", bcs: "Pokreni kalkulator", en: "Start Affordability" })}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="card block p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <Icon className="h-6 w-6 text-[var(--terra)]" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#1d1d1f]">
              {pick(locale, { sv: "Öppna", ar: "فتح", fi: "Avaa", bcs: "Otvori", en: "Open" })} <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
