import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { getLocations } from "@/lib/queries/locations";
import { getProperties } from "@/lib/queries/properties";

interface Props {
  params: Promise<{ city: string; area: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, area } = await params;
  const cityName = decodeURIComponent(city);
  const areaName = decodeURIComponent(area);
  return {
    title: `Bostader i ${areaName}, ${cityName} | Hemly`,
    description: `Utforska bostader i ${areaName}, ${cityName}.`
  };
}

export async function generateStaticParams() {
  try {
    const rows = await getLocations();
    return rows.map((row) => ({
      city: row.city,
      area: row.area
    }));
  } catch {
    return [];
  }
}

export default async function AreaPage({ params }: Props) {
  const { city, area } = await params;
  const cityName = decodeURIComponent(city);
  const areaName = decodeURIComponent(area);
  const result = await getProperties({ city: cityName, area: areaName, pageSize: 48 });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">
        Bostader i {areaName}, {cityName}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {result.data.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
