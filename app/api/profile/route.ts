import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validators";

export async function GET() {
  const { supabase, user } = await getAuthContext();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, language, monthly_income, savings, preferred_down_payment, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function PATCH(req: NextRequest) {
  const { supabase, user } = await getAuthContext();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data, error } = await supabase
    .from("users")
    .update(parsed.data)
    .eq("id", user.id)
    .select("id, email, name, language, monthly_income, savings, preferred_down_payment, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

