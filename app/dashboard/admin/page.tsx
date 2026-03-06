import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { AdminImportsPanel } from "@/components/admin-imports-panel";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Admin panel</h1>
      <p className="text-sm text-slate-600">Moderate listing status, manage agents and imports.</p>
      <AdminModerationPanel />
      <AdminImportsPanel />
    </section>
  );
}
