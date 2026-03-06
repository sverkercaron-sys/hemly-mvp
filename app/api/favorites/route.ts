import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getSessionUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id };
}

export async function GET() {
  const { supabase, userId } = await getSessionUserId();
  if (!userId) return NextResponse.json({ favorites: [] });

  const { data, error } = await supabase
    .from("favorites")
    .select("id, property_id, properties:property_id(slug, title, price)")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ favorites: data });
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { property_id } = (await req.json()) as { property_id?: string };
  if (!property_id) return NextResponse.json({ error: "property_id required" }, { status: 400 });

  const { error } = await supabase.from("favorites").insert({ user_id: userId, property_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { supabase, userId } = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const propertyId = req.nextUrl.searchParams.get("property_id");
  if (!propertyId) return NextResponse.json({ error: "property_id required" }, { status: 400 });

  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("property_id", propertyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
