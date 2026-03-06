import { MapView } from "@/components/map-view";
import { getProperties } from "@/lib/queries/properties";
import { Property } from "@/lib/types";

export default async function MapPage() {
  let properties: Property[] = [];
  try {
    const result = await getProperties({ page: 1, pageSize: 300 });
    properties = result.data;
  } catch {
    properties = [];
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Explore map</h1>
      <MapView properties={properties} />
    </section>
  );
}
