import { AgentListingForm } from "@/components/agent-listing-form";

export default function AgentDashboardPage() {
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">Agent workflow</p>
        <h1 className="section-title mt-1">Agent dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Create listings and send them to moderation in one flow.</p>
      </div>
      <AgentListingForm />
    </section>
  );
}
