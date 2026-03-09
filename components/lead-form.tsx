"use client";

import { useState } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

export function LeadForm({ propertyId }: { propertyId: string }) {
  const [status, setStatus] = useState<string>("");
  const locale = useLocale();

  async function onSubmit(formData: FormData) {
    setStatus(pick(locale, { sv: "Skickar...", ar: "جارٍ الإرسال...", fi: "Lähetetään...", bcs: "Šalje se...", en: "Sending..." }));
    const payload = {
      property_id: propertyId,
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setStatus(res.ok ? pick(locale, { sv: "Meddelandet är skickat", ar: "تم الإرسال", fi: "Viesti lähetetty", bcs: "Poruka je poslata", en: "Message sent" }) : pick(locale, { sv: "Kunde inte skicka", ar: "تعذر الإرسال", fi: "Lähetys epäonnistui", bcs: "Slanje nije uspjelo", en: "Could not send" }));
  }

  return (
    <form action={onSubmit} className="card h-fit space-y-3 p-5">
      <p className="kicker">{pick(locale, { sv: "Kontakt", ar: "اتصال", fi: "Yhteys", bcs: "Kontakt", en: "Contact" })}</p>
      <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        {pick(locale, { sv: "Kontakta mäklare", ar: "تواصل مع الوكيل", fi: "Ota yhteys välittäjään", bcs: "Kontaktiraj agenta", en: "Contact agent" })}
      </h3>
      <input name="email" type="email" required placeholder={pick(locale, { sv: "Din e-post", ar: "بريدك الإلكتروني", fi: "Sähköposti", bcs: "Vaš email", en: "Your email" })} className="input-shell" />
      <textarea name="message" required rows={5} placeholder={pick(locale, { sv: "Jag är intresserad av bostaden...", ar: "أنا مهتم بهذا العقار...", fi: "Olen kiinnostunut kohteesta...", bcs: "Zainteresovan sam za nekretninu...", en: "I am interested in this property..." })} className="input-shell" />
      <button className="button-primary w-full" type="submit">
        {pick(locale, { sv: "Skicka förfrågan", ar: "إرسال", fi: "Lähetä", bcs: "Pošalji", en: "Send inquiry" })}
      </button>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
    </form>
  );
}
