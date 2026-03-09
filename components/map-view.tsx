"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import type { CircleLayer, SymbolLayer } from "react-map-gl";
import type { FeatureCollection, Point } from "geojson";
import { Property } from "@/lib/types";
import { formatSEK } from "@/lib/utils";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

const clusterLayer: CircleLayer = {
  id: "clusters",
  type: "circle",
  source: "properties",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#1A1714",
    "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 30, 30],
    "circle-opacity": 0.85
  }
};

const clusterCountLayer: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "properties",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 12
  },
  paint: {
    "text-color": "#ffffff"
  }
};

export function MapView({ properties }: { properties: Property[] }) {
  const [selected, setSelected] = useState<Property | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const locale = useLocale();

  const geoJson = useMemo<FeatureCollection<Point, { id: string; title: string }>>(
    () => ({
      type: "FeatureCollection",
      features: properties.map((p) => ({
        type: "Feature",
        properties: { id: p.id, title: p.title },
        geometry: {
          type: "Point",
          coordinates: [p.longitude, p.latitude]
        }
      }))
    }),
    [properties]
  );

  if (!token) {
    return <p className="card p-6 text-sm text-[var(--muted)]">{pick(locale, { sv: "Mapbox-token saknas.", ar: "رمز Mapbox مفقود.", fi: "Mapbox-token puuttuu.", bcs: "Nedostaje Mapbox token.", en: "Mapbox token is missing." })}</p>;
  }

  return (
    <div className="card h-[70vh] overflow-hidden">
      <Map initialViewState={{ longitude: 18.06, latitude: 59.33, zoom: 4.8 }} mapStyle="mapbox://styles/mapbox/streets-v12" mapboxAccessToken={token}>
        <Source id="properties" type="geojson" data={geoJson} cluster clusterMaxZoom={14} clusterRadius={50}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
        </Source>
        {properties.map((property) => (
          <Marker key={property.id} longitude={property.longitude} latitude={property.latitude} anchor="bottom" onClick={() => setSelected(property)}>
            <button className="rounded-full border border-[#d8cbbb] bg-white px-2 py-1 text-xs font-semibold shadow-sm">{formatSEK(property.price)}</button>
          </Marker>
        ))}
        {selected ? (
          <Popup longitude={selected.longitude} latitude={selected.latitude} closeOnClick={false} onClose={() => setSelected(null)}>
            <div className="space-y-2 text-sm">
              <Image src="/brand/hemly-pin-terra.svg" alt="pin" width={18} height={24} className="h-5 w-auto" />
              <p className="font-semibold">{selected.title}</p>
              <p>{formatSEK(selected.price)}</p>
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
}
