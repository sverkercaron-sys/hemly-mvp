import { redirect } from "next/navigation";
import { NotificationsPanel } from "@/components/notifications-panel";
import { getAuthContext } from "@/lib/auth";
import { getServerLocale, pick } from "@/lib/i18n";

export default async function NotificationsPage() {
  const { user } = await getAuthContext();
  if (!user) redirect("/auth");

  const locale = await getServerLocale();

  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">{pick(locale, { sv: "Notifieringar", ar: "الإشعارات", fi: "Ilmoitukset", bcs: "Obavijesti", en: "Notifications" })}</p>
        <h1 className="section-title mt-1">{pick(locale, { sv: "Nya matchningar", ar: "مطابقات جديدة", fi: "Uudet osumat", bcs: "Nova podudaranja", en: "New matches" })}</h1>
      </div>
      <NotificationsPanel />
    </section>
  );
}

