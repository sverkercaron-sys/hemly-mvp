"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="space-y-1 text-xs font-bold uppercase tracking-wide text-[#6a5647]">{children}</label>;
}

export function SearchFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  function onSubmit(formData: FormData) {
    const next = new URLSearchParams();

    const fields = ["city", "area", "propertyType", "sortBy"];
    for (const field of fields) {
      const value = String(formData.get(field) ?? "").trim();
      if (value) next.set(field, value);
    }

    const numberFields = ["priceMin", "priceMax", "monthlyCostMax", "roomsMin", "sizeMin"];
    for (const field of numberFields) {
      const parsed = toNumber(String(formData.get(field) ?? ""));
      if (parsed) next.set(field, String(parsed));
    }

    router.push(`/bostader?${next.toString()}`);
  }

  return (
    <form action={onSubmit} className="card grid gap-4 p-4 md:grid-cols-4">
      <Label>
        {pick(locale, { sv: "Stad", ar: "المدينة", fi: "Kaupunki", bcs: "Grad", en: "City" })}
        <select name="city" defaultValue={params.get("city") ?? ""} className="input-shell">
          <option value="">{pick(locale, { sv: "Alla", ar: "الكل", fi: "Kaikki", bcs: "Sve", en: "Any city" })}</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Label>

      <Label>
        {pick(locale, { sv: "Område", ar: "المنطقة", fi: "Alue", bcs: "Područje", en: "Area" })}
        <input name="area" placeholder={pick(locale, { sv: "Alla områden", ar: "كل المناطق", fi: "Kaikki alueet", bcs: "Sva područja", en: "Any area" })} defaultValue={params.get("area") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Pris min", ar: "أدنى سعر", fi: "Hinta min", bcs: "Min cijena", en: "Price min" })}
        <input name="priceMin" type="number" placeholder="0" defaultValue={params.get("priceMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Pris max", ar: "أعلى سعر", fi: "Hinta max", bcs: "Max cijena", en: "Price max" })}
        <input name="priceMax" type="number" placeholder={pick(locale, { sv: "Ingen max", ar: "بدون حد", fi: "Ei maksimia", bcs: "Bez maksimuma", en: "No max" })} defaultValue={params.get("priceMax") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Månadskostnad max", ar: "الحد الشهري", fi: "Kuukausikulu max", bcs: "Maks mjesečno", en: "Monthly cost max" })}
        <input name="monthlyCostMax" type="number" placeholder={pick(locale, { sv: "Ingen max", ar: "بدون حد", fi: "Ei maksimia", bcs: "Bez maksimuma", en: "No max" })} defaultValue={params.get("monthlyCostMax") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Rum min", ar: "الغرف", fi: "Huoneet", bcs: "Sobe", en: "Rooms min" })}
        <input name="roomsMin" type="number" min={1} step={0.5} placeholder="1" defaultValue={params.get("roomsMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Storlek min", ar: "المساحة", fi: "Pinta-ala", bcs: "Veličina", en: "Size min" })}
        <input name="sizeMin" type="number" placeholder="20" defaultValue={params.get("sizeMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        {pick(locale, { sv: "Bostadstyp", ar: "نوع السكن", fi: "Asuntotyyppi", bcs: "Tip nekretnine", en: "Property type" })}
        <select name="propertyType" defaultValue={params.get("propertyType") ?? ""} className="input-shell">
          <option value="">{pick(locale, { sv: "Alla", ar: "الكل", fi: "Kaikki", bcs: "Svi", en: "Any type" })}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Label>

      <Label>
        {pick(locale, { sv: "Sortering", ar: "الترتيب", fi: "Lajittelu", bcs: "Sortiranje", en: "Sort by" })}
        <select name="sortBy" defaultValue={params.get("sortBy") ?? "newest"} className="input-shell">
          <option value="newest">{pick(locale, { sv: "Nyast", ar: "الأحدث", fi: "Uusimmat", bcs: "Najnovije", en: "Newest" })}</option>
          <option value="priceAsc">{pick(locale, { sv: "Pris stigande", ar: "السعر تصاعديًا", fi: "Hinta nouseva", bcs: "Cijena rastuće", en: "Price ascending" })}</option>
          <option value="priceDesc">{pick(locale, { sv: "Pris fallande", ar: "السعر تنازليًا", fi: "Hinta laskeva", bcs: "Cijena opadajuće", en: "Price descending" })}</option>
        </select>
      </Label>

      <button type="submit" className="button-primary md:self-end">
        {pick(locale, { sv: "Sök bostäder", ar: "ابحث", fi: "Hae", bcs: "Pretraži", en: "Search homes" })}
      </button>
    </form>
  );
}
