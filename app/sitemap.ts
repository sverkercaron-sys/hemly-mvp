import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hemly.vercel.app";
  let locationRows: Array<{ city: string; area: string }> = [];
  let properties: Array<{ slug: string; created_at: string }> = [];
  try {
    const supabase = createPublicClient();
    const [locationsRes, propertiesRes] = await Promise.all([
      supabase.from("properties").select("city, area").eq("status", "approved").limit(1000),
      supabase.from("properties").select("slug, created_at").eq("status", "approved").limit(1000)
    ]);
    locationRows = locationsRes.data ?? [];
    properties = propertiesRes.data ?? [];
  } catch {
    locationRows = [];
    properties = [];
  }

  const locationUrls = new Set<string>();
  for (const row of locationRows) {
    locationUrls.add(`${base}/bostader/${encodeURIComponent(row.city)}`);
    locationUrls.add(`${base}/bostader/${encodeURIComponent(row.city)}/${encodeURIComponent(row.area)}`);
  }

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/bostader`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/map`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/affordability`, changeFrequency: "weekly", priority: 0.7 },
    ...Array.from(locationUrls).map((url) => ({ url, changeFrequency: "daily" as const, priority: 0.8 })),
    ...properties.map((property) => ({
      url: `${base}/bostad/${property.slug}`,
      lastModified: property.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
