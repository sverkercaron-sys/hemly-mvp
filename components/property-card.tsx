import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatMonthly, formatSEK } from "@/lib/utils";
import { toOptimizedImageUrl } from "@/lib/images";
import { getServerLocale, pick } from "@/lib/i18n";

export async function PropertyCard({ property }: { property: Property }) {
  const locale = await getServerLocale();
  const cover = toOptimizedImageUrl(property.images?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200", 900, 65);

  return (
    <article className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-56 w-full">
        <Image src={cover} alt={property.title} fill className="object-cover" loading="lazy" />
      </div>

      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {property.city} - {property.area}
        </p>

        <h3 className="line-clamp-1 text-[1.85rem] font-semibold leading-tight tracking-tight text-[#1d1d1f]">{property.title}</h3>

        <p className="text-sm text-[var(--muted)]">
          {property.rooms} {pick(locale, { sv: "rum", ar: "غرف", fi: "huonetta", bcs: "soba", en: "rooms" })} - {property.size} sqm
        </p>

        <div className="space-y-1">
          <p className="text-[2.35rem] font-semibold leading-none tracking-tight text-[#1d1d1f]">{formatSEK(property.price)}</p>
          <p className="text-base font-medium text-[var(--muted)]">{formatMonthly(property.monthly_cost_estimate)}</p>
        </div>

        <Link href={`/bostad/${property.slug}`} className="button-secondary w-full">
          {pick(locale, { sv: "Visa bostad", ar: "عرض العقار", fi: "Näytä kohde", bcs: "Pogledaj", en: "View property" })}
        </Link>
      </div>
    </article>
  );
}
