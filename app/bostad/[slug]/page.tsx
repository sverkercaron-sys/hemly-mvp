import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { getPropertyBySlug } from "@/lib/queries/properties";
import { formatMonthly, formatSEK } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property not found | Hemly"
    };
  }

  return {
    title: `${property.title} | Hemly`,
    description: `${property.city}, ${property.area}. ${formatSEK(property.price)}.`
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const images = property.images?.length
    ? property.images
    : [{ id: "fallback", property_id: property.id, url: "https://picsum.photos/seed/hemly-fallback-detail/1600/1000", image_order: 0 }];

  return (
    <section className="space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        {images.slice(0, 3).map((img) => (
          <div key={img.id} className="relative h-64 overflow-hidden rounded-2xl border bg-white">
            <Image src={img.url} alt={property.title} fill className="object-cover" priority={img.image_order === 0} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <section className="card space-y-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {property.city} - {property.area}
            </p>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-2xl font-black">{formatSEK(property.price)}</p>
            <p className="text-sm font-medium text-slate-600">{formatMonthly(property.monthly_cost_estimate)}</p>
            <p className="text-sm text-slate-700">
              Monthly fee {formatSEK(property.monthly_fee)} - {property.rooms} rooms - {property.size} sqm
            </p>
            <p className="pt-2 text-slate-700">{property.description}</p>
          </section>
          <MortgageCalculator homePrice={property.price} monthlyFee={property.monthly_fee} />
        </div>
        <LeadForm propertyId={property.id} />
      </div>
    </section>
  );
}
