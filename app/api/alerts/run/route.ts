import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

export async function POST() {
  const { supabase, role } = await getAuthContext();
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ data: profiles }, { data: latestProperties }] = await Promise.all([
    supabase.from("search_profiles").select("*").limit(500),
    supabase.from("properties").select("id, city, price, monthly_cost_estimate").eq("status", "approved").order("created_at", { ascending: false }).limit(150)
  ]);

  const notifications = (profiles ?? []).map((profile) => {
    const matches = (latestProperties ?? []).filter((property) => {
      if (property.city !== profile.city) return false;
      if (profile.price_max && property.price > profile.price_max) return false;
      if (profile.monthly_cost_max && property.monthly_cost_estimate > profile.monthly_cost_max) return false;
      return true;
    });

    return {
      user_id: profile.user_id,
      matches: matches.length
    };
  });

  return NextResponse.json({
    ok: true,
    notificationsQueued: notifications.filter((n) => n.matches > 0).length,
    note: "Wire this endpoint to Resend/SMTP for production emails."
  });
}
