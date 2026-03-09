import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/list-state";
import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { getProperties } from "@/lib/queries/properties";
import { getServerLocale, pick } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseNum(value: string | string[] | undefined) {
  const str = Array.isArray(value) ? value[0] : value;
  if (!str) return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : undefined;
}

function parseString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const locale = await getServerLocale();
  const params = await searchParams;
  const page = parseNum(params.page) ?? 1;

  let defaultProfile: { city: string; price_max: number | null; monthly_cost_max: number | null } | null = null;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user?.id) {
      const { data } = await supabase
        .from("search_profiles")
        .select("city, price_max, monthly_cost_max")
        .eq("user_id", auth.user.id)
        .eq("is_default", true)
        .maybeSingle();
      defaultProfile = data ?? null;
    }
  } catch {
    defaultProfile = null;
  }

  if (defaultProfile) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string") query.set(key, value);
    });

    let changed = false;
    if (!query.get("city") && defaultProfile.city) {
      query.set("city", defaultProfile.city);
      changed = true;
    }
    if (!query.get("priceMax") && defaultProfile.price_max) {
      query.set("priceMax", String(defaultProfile.price_max));
      changed = true;
    }
    if (!query.get("monthlyCostMax") && defaultProfile.monthly_cost_max) {
      query.set("monthlyCostMax", String(defaultProfile.monthly_cost_max));
      changed = true;
    }
    if (changed) {
      redirect(`/bostader?${query.toString()}`);
    }
  }

  const city = parseString(params.city) ?? defaultProfile?.city;
  const priceMax = parseNum(params.priceMax) ?? (defaultProfile?.price_max ?? undefined);
  const monthlyCostMax = parseNum(params.monthlyCostMax) ?? (defaultProfile?.monthly_cost_max ?? undefined);

  const result = await getProperties({
    city,
    area: parseString(params.area),
    priceMin: parseNum(params.priceMin),
    priceMax,
    monthlyCostMax,
    roomsMin: parseNum(params.roomsMin),
    sizeMin: parseNum(params.sizeMin),
    propertyType: parseString(params.propertyType),
    sortBy: (parseString(params.sortBy) as "newest" | "priceAsc" | "priceDesc" | undefined) ?? "newest",
    page,
    pageSize: 12
  });

  const totalPages = Math.max(1, Math.ceil(result.count / result.pageSize));
  const base = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key !== "page" && typeof value === "string") base.set(key, value);
  });

  return (
    <section className="space-y-5">
      <div className="soft-panel p-6 sm:p-8">
        <p className="kicker">{pick(locale, { sv: "Sök", ar: "بحث", fi: "Haku", bcs: "Pretraga", en: "Search" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Bostäder till salu", ar: "منازل للبيع", fi: "Kodit myynnissä", bcs: "Nekretnine na prodaju", en: "Homes for sale" })}</h1>
      </div>

      <SearchFilters />

      {result.data.length === 0 ? (
        <EmptyState text={pick(locale, { sv: "Inga bostäder matchade filtren.", ar: "لا توجد نتائج مطابقة.", fi: "Ei osumia suodattimilla.", bcs: "Nema rezultata za ove filtere.", en: "No homes matched your current filters." })} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="card flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-[var(--muted)]">
              {pick(locale, { sv: "Sida", ar: "الصفحة", fi: "Sivu", bcs: "Stranica", en: "Page" })} {result.page} / {totalPages} ({result.count})
            </p>
            <div className="flex gap-2">
              <Link
                className="button-secondary"
                aria-disabled={result.page <= 1}
                href={`/bostader?${new URLSearchParams({ ...Object.fromEntries(base.entries()), page: String(Math.max(1, result.page - 1)) }).toString()}`}
              >
                {pick(locale, { sv: "Föregående", ar: "السابق", fi: "Edellinen", bcs: "Prethodno", en: "Prev" })}
              </Link>
              <Link
                className="button-secondary"
                aria-disabled={result.page >= totalPages}
                href={`/bostader?${new URLSearchParams({ ...Object.fromEntries(base.entries()), page: String(Math.min(totalPages, result.page + 1)) }).toString()}`}
              >
                {pick(locale, { sv: "Nästa", ar: "التالي", fi: "Seuraava", bcs: "Sljedeće", en: "Next" })}
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
