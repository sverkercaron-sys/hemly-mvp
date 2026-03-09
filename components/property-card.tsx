import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatMonthly, formatSEK } from "@/lib/utils";
import { toOptimizedImageUrl } from "@/lib/images";

export function PropertyCard({ property }: { property: Property }) {
  const cover = toOptimizedImageUrl(property.images?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200", 900, 65);

  return (
    <article className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-52 w-full">
        <Image src={cover} alt={property.title} fill className="object-cover" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
          <p className="inline-flex rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-slate-900">
            {property.city} - {property.area}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-1 text-4xl font-black leading-tight text-slate-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}>
          {property.title}
        </h3>
        <p className="text-sm text-slate-600">
          {property.rooms} rooms - {property.size} sqm
        </p>

        <div>
          <p className="text-4xl font-black leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
            {formatSEK(property.price)}
          </p>
          <p className="mt-1 text-base font-semibold text-slate-600">{formatMonthly(property.monthly_cost_estimate)}</p>
        </div>

        <Link href={`/bostad/${property.slug}`} className="button-secondary w-full">
          View property
        </Link>
      </div>
    </article>
  );
}
