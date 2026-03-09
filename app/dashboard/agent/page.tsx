import { AgentListingForm } from "@/components/agent-listing-form";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function AgentDashboardPage() {
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
