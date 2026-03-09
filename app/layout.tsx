import type { Metadata } from "next";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { getDirection, getServerLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Hemly - Bostadsmarknad",
  description: "Hitta ditt nästa hem i Sverige med boendekalkyl och kartvy."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} dir={getDirection(locale)}>
      <body>
        <SiteHeader />
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}
