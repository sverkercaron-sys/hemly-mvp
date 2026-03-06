import { createClient } from "@supabase/supabase-js";
import { ingestViaAdapter } from "@/api/services/import-service";
import { ListingIntegrationAdapter } from "@/api/integrations/types";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey);
}

export async function persistImport(source: string, adapter: ListingIntegrationAdapter, payload: unknown) {
  const supabase = getAdminClient();
  const normalized = await ingestViaAdapter(adapter, payload);

  for (const item of normalized) {
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .upsert(
        {
          title: item.title,
          description: item.description,
          price: item.price,
          monthly_fee: item.monthly_fee,
          size: item.size,
          rooms: item.rooms,
          property_type: item.property_type,
          year_built: null,
          city: item.city,
          area: item.area,
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
          slug: item.slug,
          agent_id: null,
          status: "pending",
          monthly_cost_estimate: item.monthly_cost_estimate
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (propertyError) throw propertyError;

    await supabase.from("listing_imports").insert({
      source,
      external_id: item.external_id
    });

    if (item.images.length) {
      await supabase.from("property_images").upsert(
        item.images.map((url, index) => ({
          property_id: property.id,
          url,
          image_order: index
        }))
      );
    }
  }

  return normalized.length;
}
