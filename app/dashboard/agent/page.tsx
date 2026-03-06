import { AgentListingForm } from "@/components/agent-listing-form";

export default function AgentDashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Agent dashboard</h1>
      <p className="text-sm text-slate-600">Create manual listings and submit them for admin moderation.</p>
      <AgentListingForm />
    </section>
  );
}
