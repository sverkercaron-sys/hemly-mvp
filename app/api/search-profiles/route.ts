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

  const { data, error } = await supabase
    .from("search_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ searchProfiles: data });
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSessionUser();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = createSearchProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: existingDefault } = await supabase
    .from("search_profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .limit(1);

  const { error } = await supabase
    .from("search_profiles")
    .insert({ user_id: userId, ...parsed.data, is_default: (existingDefault?.length ?? 0) === 0 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { supabase, userId } = await getSessionUser();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { profile_id, set_default } = (await req.json()) as { profile_id?: string; set_default?: boolean };
  if (!profile_id || !set_default) return NextResponse.json({ error: "profile_id and set_default required" }, { status: 400 });

  const { error: resetError } = await supabase.from("search_profiles").update({ is_default: false }).eq("user_id", userId);
  if (resetError) return NextResponse.json({ error: resetError.message }, { status: 500 });

  const { error } = await supabase
    .from("search_profiles")
    .update({ is_default: true })
    .eq("user_id", userId)
    .eq("id", profile_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
