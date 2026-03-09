import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";

const moderationSchema = z.object({
  propertyId: z.string().uuid(),
  status: z.enum(["approved", "rejected"])
});

export async function PATCH(req: NextRequest) {
  const { supabase, role } = await getAuthContext();
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = moderationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { error } = await supabase
    .from("properties")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.propertyId)
    .eq("status", "pending");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
