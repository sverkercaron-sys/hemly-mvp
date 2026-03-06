import { createPublicClient } from "@/lib/supabase/public";
import { Property, PropertySearchFilters } from "@/lib/types";

export async function getProperties(filters: PropertySearchFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createPublicClient();
  let query = supabase.from("properties_with_images").select("*", { count: "exact" }).eq("status", "approved");

  if (filters.city) query = query.eq("city", filters.city);
  if (filters.area) query = query.eq("area", filters.area);
  if (filters.priceMin) query = query.gte("price", filters.priceMin);
  if (filters.priceMax) query = query.lte("price", filters.priceMax);
  if (filters.monthlyCostMax) query = query.lte("monthly_cost_estimate", filters.monthlyCostMax);
  if (filters.roomsMin) query = query.gte("rooms", filters.roomsMin);
  if (filters.sizeMin) query = query.gte("size", filters.sizeMin);
  if (filters.propertyType) query = query.eq("property_type", filters.propertyType);

  switch (filters.sortBy) {
    case "priceAsc":
      query = query.order("price", { ascending: true });
      break;
    case "priceDesc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    data: (data ?? []) as unknown as Property[],
    count: count ?? 0,
    page,
    pageSize
  };
}

export async function getPropertyBySlug(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties_with_images")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error) return null;
  return data as Property;
}
