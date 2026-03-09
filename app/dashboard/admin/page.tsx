import { AdminModerationPanel } from "@/components/admin-moderation-panel";
import { AdminImportsPanel } from "@/components/admin-imports-panel";
import { getServerLocale, pick } from "@/lib/i18n";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const { role } = await getAuthContext();
  if (role !== "admin") redirect("/auth");

  const locale = await getServerLocale();
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Administration", ar: "الإدارة", fi: "Ylläpito", bcs: "Administracija", en: "Admin" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Adminpanel", ar: "لوحة الإدارة", fi: "Ylläpitopaneeli", bcs: "Admin panel", en: "Admin panel" })}</h1>
      </div>
      <AdminModerationPanel />
      <AdminImportsPanel />
    </section>
  );
}
