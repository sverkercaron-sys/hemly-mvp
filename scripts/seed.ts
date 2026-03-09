import { createClient } from "@supabase/supabase-js";
import { AREAS_BY_CITY, CITIES } from "@/lib/constants";
import { estimateMonthlyCost, slugify } from "@/lib/utils";

const descriptions = [
  "Modern floorplan with generous natural light and renovated kitchen.",
  "Well planned home close to transit, schools and green areas.",
  "Move-in ready with balcony, storage and updated bathroom.",
  "Calm street location with strong neighborhood amenities."
];

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, key);

  const rows = Array.from({ length: 300 }).map((_, i) => {
    const city = CITIES[i % CITIES.length];
    const areas = AREAS_BY_CITY[city];
    const area = areas[i % areas.length];
    const price = random(2_300_000, 11_800_000);
    const monthlyFee = random(1500, 8500);
    const size = random(28, 210);
    const rooms = Number((Math.random() * 5.5 + 1).toFixed(1));
    const type = (["apartment", "villa", "townhouse", "cottage"] as const)[i % 4];
    const slug = `${slugify(city)}-${slugify(area)}-${i + 1}`;

    return {
      title: `${city} ${rooms} rum, ${size} kvm`,
      description: descriptions[i % descriptions.length],
      price,
      monthly_fee: monthlyFee,
      size,
      rooms,
      property_type: type,
      year_built: random(1955, 2024),
      city,
      area,
      address: `Gata ${i + 1}`,
      latitude: city === "Stockholm" ? 59.33 + Math.random() * 0.07 : city === "Göteborg" ? 57.70 + Math.random() * 0.07 : city === "Malmö" ? 55.60 + Math.random() * 0.07 : 59.86 + Math.random() * 0.07,
      longitude: city === "Stockholm" ? 18.06 + Math.random() * 0.07 : city === "Göteborg" ? 11.97 + Math.random() * 0.07 : city === "Malmö" ? 13.0 + Math.random() * 0.07 : 17.64 + Math.random() * 0.07,
      slug,
      status: "approved",
      monthly_cost_estimate: estimateMonthlyCost(price, monthlyFee)
    };
  });

  const { data, error } = await supabase.from("properties").upsert(rows, { onConflict: "slug" }).select("id");
  if (error) throw error;

  if (data?.length) {
    const imageRows = data.map((item, idx) => ({
      property_id: item.id,
      url: `https://picsum.photos/seed/hemly-${idx + 1}/1200/800`,
      image_order: 0
    }));

    await supabase.from("property_images").upsert(imageRows, { onConflict: "property_id,image_order" });
  }

  console.log(`Seeded ${data?.length ?? 0} properties`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
