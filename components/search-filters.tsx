"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function SearchFilters() {
  const params = useSearchParams();
  const router = useRouter();

  function onSubmit(formData: FormData) {
    const next = new URLSearchParams();

    const fields = ["city", "area", "propertyType", "sortBy"];
    for (const field of fields) {
      const value = String(formData.get(field) ?? "").trim();
      if (value) next.set(field, value);
    }

    const numberFields = ["priceMin", "priceMax", "monthlyCostMax", "roomsMin", "sizeMin"];
    for (const field of numberFields) {
      const parsed = toNumber(String(formData.get(field) ?? ""));
      if (parsed) next.set(field, String(parsed));
    }

    router.push(`/bostader?${next.toString()}`);
  }

  return (
    <form action={onSubmit} className="card grid gap-3 p-4 md:grid-cols-4">
      <select name="city" defaultValue={params.get("city") ?? ""} className="rounded-xl border p-2">
        <option value="">City</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <input name="area" placeholder="Area" defaultValue={params.get("area") ?? ""} className="rounded-xl border p-2" />
      <input
        name="priceMin"
        type="number"
        placeholder="Price min"
        defaultValue={params.get("priceMin") ?? ""}
        className="rounded-xl border p-2"
      />
      <input
        name="priceMax"
        type="number"
        placeholder="Price max"
        defaultValue={params.get("priceMax") ?? ""}
        className="rounded-xl border p-2"
      />
      <input
        name="monthlyCostMax"
        type="number"
        placeholder="Monthly cost max"
        defaultValue={params.get("monthlyCostMax") ?? ""}
        className="rounded-xl border p-2"
      />
      <input
        name="roomsMin"
        type="number"
        min={1}
        step={0.5}
        placeholder="Rooms min"
        defaultValue={params.get("roomsMin") ?? ""}
        className="rounded-xl border p-2"
      />
      <input
        name="sizeMin"
        type="number"
        placeholder="Size min (sqm)"
        defaultValue={params.get("sizeMin") ?? ""}
        className="rounded-xl border p-2"
      />
      <select name="propertyType" defaultValue={params.get("propertyType") ?? ""} className="rounded-xl border p-2">
        <option value="">Property type</option>
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select name="sortBy" defaultValue={params.get("sortBy") ?? "newest"} className="rounded-xl border p-2">
        <option value="newest">Newest</option>
        <option value="priceAsc">Price ascending</option>
        <option value="priceDesc">Price descending</option>
      </select>
      <button type="submit" className="button-primary">
        Search
      </button>
    </form>
  );
}
