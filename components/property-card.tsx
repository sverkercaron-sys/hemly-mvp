import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatMonthly, formatSEK } from "@/lib/utils";
import { toOptimizedImageUrl } from "@/lib/images";

export function PropertyCard({ property }: { property: Property }) {
  const cover = toOptimizedImageUrl(property.images?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200", 900, 65);

  return (
    <article className="card overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={cover} alt={property.title} fill className="object-cover" loading="lazy" />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {property.city} - {property.area}
        </p>
        <h3 className="line-clamp-1 text-lg font-semibold">{property.title}</h3>
        <p className="text-sm text-slate-600">
          {property.rooms} rooms - {property.size} sqm
        </p>
        <p className="text-2xl font-bold leading-none">{formatSEK(property.price)}</p>
        <p className="text-sm font-medium text-slate-600">{formatMonthly(property.monthly_cost_estimate)}</p>
        <Link href={`/bostad/${property.slug}`} className="button-secondary mt-2 w-full">
          View property
        </Link>
      </div>
    </article>
  );
}
