import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createPropertySchema } from "@/lib/validators";
import { estimateMonthlyCost, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip, 90)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const status = req.nextUrl.searchParams.get("status") ?? "approved";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, city, status")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip, 15)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = await req.json();
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const payload = parsed.data;
  const { image_urls, ...propertyValues } = payload;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: agentRow } = await supabase
    .from("agents")
    .select("id")
    .eq("email", auth.user.email ?? "")
    .maybeSingle();

  const { data, error } = await supabase
    .from("properties")
    .insert({
      ...propertyValues,
      slug: `${slugify(payload.city)}-${slugify(payload.area)}-${slugify(payload.title)}-${Date.now()}`,
      status: "pending",
      latitude: 59.33,
      longitude: 18.06,
      year_built: null,
      agent_id: agentRow?.id ?? null,
      monthly_cost_estimate: estimateMonthlyCost(propertyValues.price, propertyValues.monthly_fee, 0.04, 30, propertyValues.operating_cost)
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (image_urls?.length) {
    const { error: imageError } = await supabase.from("property_images").insert(
      image_urls.map((url, idx) => ({
        property_id: data.id,
        url,
        image_order: idx
      }))
    );
    if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
