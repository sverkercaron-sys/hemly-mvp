import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { getLocations } from "@/lib/queries/locations";
import { getProperties } from "@/lib/queries/properties";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const name = decodeURIComponent(city);
  return {
    title: `Bostader i ${name} | Hemly`,
    description: `Se tillgangliga bostader i ${name} med pris och manadskostnad.`
  };
}

export async function generateStaticParams() {
  try {
    const rows = await getLocations();
    const cities = new Set(rows.map((row) => row.city));
    return Array.from(cities).map((city) => ({ city }));
  } catch {
    return [];
  }
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  const result = await getProperties({ city: cityName, pageSize: 48 });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Bostader i {cityName}</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {result.data.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
