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
      <div className="soft-panel p-6 sm:p-8">
        <p className="kicker">Map search</p>
        <h1 className="section-title mt-1">Explore homes on the map</h1>
        <p className="mt-2 text-[var(--muted)]">Zoom, cluster, and compare locations with live price markers.</p>
      </div>
      <MapView properties={properties} />
    </section>
  );
}
