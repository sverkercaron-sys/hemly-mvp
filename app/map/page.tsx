import { MapView } from "@/components/map-view";
import { getProperties } from "@/lib/queries/properties";
import { Property } from "@/lib/types";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function MapPage() {
  const locale = await getServerLocale();
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
        <p className="kicker">{pick(locale, { sv: "Karta", ar: "الخريطة", fi: "Kartta", bcs: "Mapa", en: "Map" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Utforska bostäder på kartan", ar: "استكشف المنازل على الخريطة", fi: "Tutki koteja kartalla", bcs: "Istraži domove na mapi", en: "Explore homes on the map" })}</h1>
      </div>
      <MapView properties={properties} />
    </section>
  );
}
