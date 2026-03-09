import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { getPropertyBySlug } from "@/lib/queries/properties";
import { formatMonthly, formatSEK } from "@/lib/utils";
import { getServerLocale, pick } from "@/lib/i18n";

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
  const locale = await getServerLocale();
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const images = property.images?.length
    ? property.images
    : [{ id: "fallback", property_id: property.id, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600", image_order: 0 }];

  return (
    <section className="space-y-5">
      <div className="soft-panel p-6 sm:p-8">
        <p className="kicker">
          {property.city} - {property.area}
        </p>
        <h1 className="section-title mt-1">{property.title}</h1>
        <div className="mt-3 flex flex-wrap gap-5">
          <p className="text-5xl font-semibold tracking-tight text-[#1d1d1f]">{formatSEK(property.price)}</p>
          <p className="text-lg font-medium text-[var(--muted)]">{formatMonthly(property.monthly_cost_estimate)}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {images.slice(0, 3).map((img) => (
          <div key={img.id} className="relative h-64 overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
            <Image src={img.url} alt={property.title} fill className="object-cover" priority={img.image_order === 0} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <section className="card space-y-4 p-5">
            <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
              <p>
                <span className="font-semibold text-[#1d1d1f]">{pick(locale, { sv: "Månadsavgift", ar: "الرسوم الشهرية", fi: "Kuukausimaksu", bcs: "Mjesečna naknada", en: "Monthly fee" })}:</span> {formatSEK(property.monthly_fee)}
              </p>
              <p>
                <span className="font-semibold text-[#1d1d1f]">{pick(locale, { sv: "Rum", ar: "الغرف", fi: "Huoneet", bcs: "Sobe", en: "Rooms" })}:</span> {property.rooms}
              </p>
              <p>
                <span className="font-semibold text-[#1d1d1f]">{pick(locale, { sv: "Storlek", ar: "المساحة", fi: "Koko", bcs: "Veličina", en: "Size" })}:</span> {property.size} sqm
              </p>
              <p>
                <span className="font-semibold text-[#1d1d1f]">{pick(locale, { sv: "Adress", ar: "العنوان", fi: "Osoite", bcs: "Adresa", en: "Address" })}:</span> {property.address}
              </p>
            </div>
            <p className="text-[#1d1d1f]">{property.description}</p>
          </section>

          <MortgageCalculator homePrice={property.price} monthlyFee={property.monthly_fee} />
        </div>

        <LeadForm propertyId={property.id} />
      </div>
    </section>
  );
}
