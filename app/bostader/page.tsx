import Link from "next/link";
import { EmptyState } from "@/components/list-state";
import { PropertyCard } from "@/components/property-card";
import { SearchFilters } from "@/components/search-filters";
import { getProperties } from "@/lib/queries/properties";

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
  const params = await searchParams;
  const page = parseNum(params.page) ?? 1;

  const result = await getProperties({
    city: parseString(params.city),
    area: parseString(params.area),
    priceMin: parseNum(params.priceMin),
    priceMax: parseNum(params.priceMax),
    monthlyCostMax: parseNum(params.monthlyCostMax),
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
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Homes for sale</h1>
      <SearchFilters />
      {result.data.length === 0 ? (
        <EmptyState text="No homes matched your current filters." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Page {result.page} / {totalPages} ({result.count} homes)
            </p>
            <div className="flex gap-2">
              <Link
                className="button-secondary"
                aria-disabled={result.page <= 1}
                href={`/bostader?${new URLSearchParams({ ...Object.fromEntries(base.entries()), page: String(Math.max(1, result.page - 1)) }).toString()}`}
              >
                Prev
              </Link>
              <Link
                className="button-secondary"
                aria-disabled={result.page >= totalPages}
                href={`/bostader?${new URLSearchParams({ ...Object.fromEntries(base.entries()), page: String(Math.min(totalPages, result.page + 1)) }).toString()}`}
              >
                Next
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
