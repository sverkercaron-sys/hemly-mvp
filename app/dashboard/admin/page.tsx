import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { AdminImportsPanel } from "@/components/admin-imports-panel";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">Platform control</p>
        <h1 className="section-title mt-1">Admin panel</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Moderate listing status, manage users and listing imports.</p>
      </div>
      <AdminModerationPanel />
      <AdminImportsPanel />
    </section>
  );
}
