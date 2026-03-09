import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "agent" | "user" | "anonymous";

export function getRoleFromUser(user: User | null): AppRole {
  if (!user) return "anonymous";
  const role = String(user.app_metadata?.role ?? "").toLowerCase();
  if (role === "admin") return "admin";
  if (role === "agent") return "agent";
  return "user";
}

export async function getAuthContext() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  return {
    supabase,
    user,
    role: getRoleFromUser(user)
  };
}

export async function isAgentByEmail(email: string | null | undefined) {
  if (!email) return false;
  const supabase = await createClient();
  const { data, error } = await supabase.from("agents").select("id").eq("email", email).maybeSingle();
  return !error && Boolean(data?.id);
}

