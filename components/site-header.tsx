import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthControls } from "@/components/auth-controls";
import { getServerLocale, pick } from "@/lib/i18n";

export async function SiteHeader() {
  const locale = await getServerLocale();

  const links = [
    { href: "/bostader", label: pick(locale, { sv: "Bostäder", ar: "المنازل", fi: "Kodit", bcs: "Nekretnine", en: "Homes" }) },
    { href: "/map", label: pick(locale, { sv: "Karta", ar: "الخريطة", fi: "Kartta", bcs: "Mapa", en: "Map" }) },
    {
      href: "/affordability",
      label: pick(locale, { sv: "Boendekalkyl", ar: "القدرة الشرائية", fi: "Budjetti", bcs: "Pristupačnost", en: "Affordability" })
    },
    { href: "/notifications", label: pick(locale, { sv: "Notiser", ar: "الإشعارات", fi: "Ilmoitukset", bcs: "Obavijesti", en: "Alerts" }) },
    { href: "/favorites", label: pick(locale, { sv: "Favoriter", ar: "المفضلة", fi: "Suosikit", bcs: "Favoriti", en: "Favorites" }) },
    { href: "/dashboard/agent", label: pick(locale, { sv: "Mäklare", ar: "الوكيل", fi: "Välittäjä", bcs: "Agent", en: "Agent" }) },
    { href: "/dashboard/admin", label: pick(locale, { sv: "Admin", ar: "المشرف", fi: "Ylläpito", bcs: "Admin", en: "Admin" }) }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#ececf1] bg-white/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-[2rem] font-semibold leading-none tracking-tight text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
            Hemly
          </span>
          <Image src="/brand/hemly-pin-terra.svg" alt="Hemly pin" width={18} height={24} className="h-5 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-[#1d1d1f] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-1.5 transition hover:bg-[#f3f3f6]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <AuthControls />
          <Link href="/dashboard/agent" className="button-primary">
            {pick(locale, { sv: "Lägg till annons", ar: "أضف إعلان", fi: "Lisää ilmoitus", bcs: "Dodaj oglas", en: "Add Listing" })}
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-semibold md:hidden">
          <Link href="/bostader" className="button-secondary px-3 py-1.5">
            {pick(locale, { sv: "Bostäder", ar: "المنازل", fi: "Kodit", bcs: "Nekretnine", en: "Homes" })}
          </Link>
          <Link href="/map" className="button-secondary px-3 py-1.5">
            {pick(locale, { sv: "Karta", ar: "الخريطة", fi: "Kartta", bcs: "Mapa", en: "Map" })}
          </Link>
          <Link href="/notifications" className="button-secondary px-3 py-1.5">
            {pick(locale, { sv: "Notiser", ar: "الإشعارات", fi: "Ilmoitukset", bcs: "Obavijesti", en: "Alerts" })}
          </Link>
          <Link href="/auth" className="button-secondary px-3 py-1.5">
            {pick(locale, { sv: "Login", ar: "دخول", fi: "Login", bcs: "Login", en: "Login" })}
          </Link>
        </nav>
      </div>
    </header>
  );
}
