import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validators";

async function ensureUserRow(
  supabase: Awaited<ReturnType<typeof getAuthContext>>["supabase"],
  user: NonNullable<Awaited<ReturnType<typeof getAuthContext>>["user"]>
) {
  await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      name: String(user.user_metadata?.name ?? ""),
      language: "sv"
    },
    { onConflict: "id" }
  );
}

export async function GET() {
  const { supabase, user } = await getAuthContext();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  await ensureUserRow(supabase, user);

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, language, monthly_income, savings, preferred_down_payment, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    if (error.message.includes("monthly_income") || error.message.includes("preferred_down_payment") || error.message.includes("savings")) {
      return NextResponse.json({ error: "Database migration missing. Run 20260309131000_auth_profile_defaults.sql in Supabase SQL editor." }, { status: 500 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}

export async function PATCH(req: NextRequest) {
  const { supabase, user } = await getAuthContext();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  await ensureUserRow(supabase, user);

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("users")
    .update(parsed.data)
    .eq("id", user.id)
    .select("id, email, name, language, monthly_income, savings, preferred_down_payment, created_at")
    .single();

  if (error) {
    if (error.message.includes("monthly_income") || error.message.includes("preferred_down_payment") || error.message.includes("savings")) {
      return NextResponse.json({ error: "Database migration missing. Run 20260309131000_auth_profile_defaults.sql in Supabase SQL editor." }, { status: 500 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}
