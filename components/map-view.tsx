"use client";

import { useMemo, useState } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import type { CircleLayer, SymbolLayer } from "react-map-gl";
import type { FeatureCollection, Point } from "geojson";
import { Property } from "@/lib/types";
import { formatSEK } from "@/lib/utils";

const clusterLayer: CircleLayer = {
  id: "clusters",
  type: "circle",
  source: "properties",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#0f766e",
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
    return <p className="card p-6 text-sm text-slate-600">Mapbox token missing. Set `NEXT_PUBLIC_MAPBOX_TOKEN`.</p>;
  }

  return (
    <div className="card h-[70vh] overflow-hidden">
      <Map
        initialViewState={{ longitude: 18.06, latitude: 59.33, zoom: 4.8 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
      >
        <Source id="properties" type="geojson" data={geoJson} cluster clusterMaxZoom={14} clusterRadius={50}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
        </Source>
        {properties.map((property) => (
          <Marker key={property.id} longitude={property.longitude} latitude={property.latitude} anchor="bottom" onClick={() => setSelected(property)}>
            <button className="rounded bg-white px-2 py-1 text-xs font-semibold shadow">{formatSEK(property.price)}</button>
          </Marker>
        ))}
        {selected ? (
          <Popup longitude={selected.longitude} latitude={selected.latitude} closeOnClick={false} onClose={() => setSelected(null)}>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{selected.title}</p>
              <p>{formatSEK(selected.price)}</p>
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
}
