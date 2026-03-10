import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const { supabase, role } = await getAuthContext();
  const isCronAuthorized = Boolean(cronSecret && token && token === cronSecret);
  if (role !== "admin" && !isCronAuthorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: profiles }, { data: latestProperties }] = await Promise.all([
    supabase.from("search_profiles").select("*").limit(500),
    supabase
      .from("properties")
      .select("id, title, city, price, monthly_cost_estimate, slug, created_at")
      .eq("status", "approved")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(150)
  ]);

  const notificationRows = (profiles ?? []).flatMap((profile) => {
    const matches = (latestProperties ?? []).filter((property: { city: string; price: number; monthly_cost_estimate: number }) => {
      if (property.city !== profile.city) return false;
      if (profile.price_max && property.price > profile.price_max) return false;
      if (profile.monthly_cost_max && property.monthly_cost_estimate > profile.monthly_cost_max) return false;
      return true;
    });

    return matches.map((property: { id: string; title: string; city: string; slug: string }) => ({
      user_id: profile.user_id,
      property_id: property.id,
      kind: "search_match",
      title: "Ny bostad som matchar din sökning",
      body: `${property.title} i ${property.city}`,
      url: `/bostad/${property.slug}`
    }));
  });

  if (notificationRows.length) {
    const { error } = await supabase
      .from("notifications")
      .upsert(notificationRows, { onConflict: "user_id,property_id,kind", ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    notificationsQueued: notificationRows.length
  });
}
