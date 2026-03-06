import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSearchProfileSchema } from "@/lib/validators";

async function getSessionUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id };
}

export async function GET() {
  const { supabase, userId } = await getSessionUser();
  if (!userId) return NextResponse.json({ searchProfiles: [] });

  const { data, error } = await supabase.from("search_profiles").select("*").eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ searchProfiles: data });
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSessionUser();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = createSearchProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { error } = await supabase.from("search_profiles").insert({ user_id: userId, ...parsed.data });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
