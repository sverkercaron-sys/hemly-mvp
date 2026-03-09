"use client";

import { useState } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

export function AgentListingForm() {
  const [status, setStatus] = useState("");
  const locale = useLocale();

  async function onSubmit(formData: FormData) {
    setStatus(pick(locale, { sv: "Skickar...", ar: "جارٍ الإرسال...", fi: "Lähetetään...", bcs: "Slanje...", en: "Submitting..." }));

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") ?? ""),
        price: Number(formData.get("price") ?? 0),
        monthly_fee: Number(formData.get("monthly_fee") ?? 0),
        size: Number(formData.get("size") ?? 0),
        rooms: Number(formData.get("rooms") ?? 0),
        description: String(formData.get("description") ?? ""),
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        area: String(formData.get("area") ?? ""),
        property_type: String(formData.get("property_type") ?? "apartment"),
        image_urls: String(formData.get("images") ?? "")
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean)
      })
    });

    setStatus(res.ok ? pick(locale, { sv: "Annons skickad för granskning", ar: "تم إرسال الإعلان", fi: "Ilmoitus lähetetty", bcs: "Oglas poslat", en: "Listing submitted for moderation" }) : pick(locale, { sv: "Kunde inte skicka", ar: "تعذر الإرسال", fi: "Lähetys epäonnistui", bcs: "Slanje nije uspjelo", en: "Submission failed" }));
  }

  return (
    <form action={onSubmit} className="card grid gap-3 p-4 md:grid-cols-2">
      <input className="rounded-xl border p-2" name="title" placeholder={pick(locale, { sv: "Rubrik", ar: "العنوان", fi: "Otsikko", bcs: "Naslov", en: "Title" })} required />
      <input className="rounded-xl border p-2" name="price" type="number" placeholder={pick(locale, { sv: "Pris", ar: "السعر", fi: "Hinta", bcs: "Cijena", en: "Price" })} required />
      <input className="rounded-xl border p-2" name="monthly_fee" type="number" placeholder={pick(locale, { sv: "Månadsavgift", ar: "الرسوم الشهرية", fi: "Kuukausimaksu", bcs: "Mjesečna naknada", en: "Monthly fee" })} required />
      <input className="rounded-xl border p-2" name="size" type="number" placeholder={pick(locale, { sv: "Storlek", ar: "المساحة", fi: "Koko", bcs: "Veličina", en: "Size" })} required />
      <input className="rounded-xl border p-2" name="rooms" type="number" placeholder={pick(locale, { sv: "Rum", ar: "الغرف", fi: "Huoneet", bcs: "Sobe", en: "Rooms" })} required />
      <input className="rounded-xl border p-2" name="property_type" placeholder={pick(locale, { sv: "Bostadstyp", ar: "نوع السكن", fi: "Asuntotyyppi", bcs: "Tip", en: "Property type" })} defaultValue="apartment" required />
      <input className="rounded-xl border p-2 md:col-span-2" name="address" placeholder={pick(locale, { sv: "Adress", ar: "العنوان", fi: "Osoite", bcs: "Adresa", en: "Address" })} required />
      <input className="rounded-xl border p-2" name="city" placeholder={pick(locale, { sv: "Stad", ar: "المدينة", fi: "Kaupunki", bcs: "Grad", en: "City" })} required />
      <input className="rounded-xl border p-2" name="area" placeholder={pick(locale, { sv: "Område", ar: "المنطقة", fi: "Alue", bcs: "Područje", en: "Area" })} required />
      <textarea className="rounded-xl border p-2 md:col-span-2" name="description" placeholder={pick(locale, { sv: "Beskrivning", ar: "الوصف", fi: "Kuvaus", bcs: "Opis", en: "Description" })} rows={5} required />
      <textarea className="rounded-xl border p-2 md:col-span-2" name="images" placeholder={pick(locale, { sv: "Bild-URL:er (en per rad)", ar: "روابط الصور", fi: "Kuva-URL:t", bcs: "URL slika", en: "Image URLs (one per line)" })} rows={3} />
      <div className="md:col-span-2 flex items-center gap-3">
        <button className="button-primary">{pick(locale, { sv: "Skapa annons", ar: "إنشاء إعلان", fi: "Luo ilmoitus", bcs: "Kreiraj oglas", en: "Create listing" })}</button>
        <p className="text-sm text-slate-600">{status}</p>
      </div>
    </form>
  );
}
