import { createPublicClient } from "@/lib/supabase/public";

export async function getLocations() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select("city, area")
    .eq("status", "approved")
    .order("city", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}
