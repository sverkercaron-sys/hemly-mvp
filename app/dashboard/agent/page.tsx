import { AgentListingForm } from "@/components/agent-listing-form";
import { getServerLocale, pick } from "@/lib/i18n";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AgentDashboardPage() {
  const { supabase, user, role } = await getAuthContext();
  if (!user) redirect("/auth");

  if (role !== "admin") {
    const { data: agent } = await supabase.from("agents").select("id").eq("email", user.email ?? "").maybeSingle();
    if (!agent?.id) redirect("/auth");
  }

  const locale = await getServerLocale();
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Mäklare", ar: "الوكيل", fi: "Välittäjä", bcs: "Agent", en: "Agent" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Mäklarpanel", ar: "لوحة الوكيل", fi: "Välittäjän hallinta", bcs: "Agent panel", en: "Agent dashboard" })}</h1>
      </div>
      <AgentListingForm />
    </section>
  );
}
