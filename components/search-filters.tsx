"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CITIES, PROPERTY_TYPES } from "@/lib/constants";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="space-y-1 text-xs font-bold uppercase tracking-wide text-slate-500">{children}</label>;
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
    <form action={onSubmit} className="card grid gap-4 p-4 md:grid-cols-4">
      <Label>
        City
        <select name="city" defaultValue={params.get("city") ?? ""} className="input-shell">
          <option value="">Any city</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Label>

      <Label>
        Area
        <input name="area" placeholder="Any area" defaultValue={params.get("area") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Price min
        <input name="priceMin" type="number" placeholder="0" defaultValue={params.get("priceMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Price max
        <input name="priceMax" type="number" placeholder="No max" defaultValue={params.get("priceMax") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Monthly cost max
        <input name="monthlyCostMax" type="number" placeholder="No max" defaultValue={params.get("monthlyCostMax") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Rooms min
        <input name="roomsMin" type="number" min={1} step={0.5} placeholder="1" defaultValue={params.get("roomsMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Size min (sqm)
        <input name="sizeMin" type="number" placeholder="20" defaultValue={params.get("sizeMin") ?? ""} className="input-shell" />
      </Label>

      <Label>
        Property type
        <select name="propertyType" defaultValue={params.get("propertyType") ?? ""} className="input-shell">
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Label>

      <Label>
        Sort by
        <select name="sortBy" defaultValue={params.get("sortBy") ?? "newest"} className="input-shell">
          <option value="newest">Newest</option>
          <option value="priceAsc">Price ascending</option>
          <option value="priceDesc">Price descending</option>
        </select>
      </Label>

      <button type="submit" className="button-primary md:col-span-1 md:self-end">
        Search homes
      </button>
    </form>
  );
}
