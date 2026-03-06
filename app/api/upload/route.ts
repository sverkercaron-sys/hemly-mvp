import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { path?: string };
  if (!body.path) return NextResponse.json({ error: "path required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("property-images").createSignedUploadUrl(body.path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
