"use client";

import { useEffect, useState } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

interface Profile {
  id: string;
  city: string;
  price_max: number | null;
  monthly_cost_max: number | null;
  is_default: boolean;
}

export function SearchProfilesPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [status, setStatus] = useState("");
  const locale = useLocale();

  async function load() {
    const res = await fetch("/api/search-profiles");
    if (res.ok) {
      const data = await res.json();
      setProfiles(data.searchProfiles ?? []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(formData: FormData) {
    setStatus(pick(locale, { sv: "Sparar...", ar: "جارٍ الحفظ...", fi: "Tallennetaan...", bcs: "Spremanje...", en: "Saving..." }));
    const res = await fetch("/api/search-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: String(formData.get("city") ?? ""),
        price_max: Number(formData.get("price_max") ?? 0) || null,
        monthly_cost_max: Number(formData.get("monthly_cost_max") ?? 0) || null
      })
    });

    setStatus(res.ok ? pick(locale, { sv: "Sparat", ar: "تم الحفظ", fi: "Tallennettu", bcs: "Sačuvano", en: "Saved" }) : pick(locale, { sv: "Kunde inte spara", ar: "تعذر الحفظ", fi: "Tallennus epäonnistui", bcs: "Nije sačuvano", en: "Could not save" }));
    if (res.ok) load();
  }

  async function onSetDefault(profileId: string) {
    const res = await fetch("/api/search-profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, set_default: true })
    });

    setStatus(
      res.ok
        ? pick(locale, { sv: "Standardsökprofil uppdaterad", ar: "تم تحديث ملف البحث الافتراضي", fi: "Oletushakuprofiili päivitetty", bcs: "Podrazumijevani profil ažuriran", en: "Default profile updated" })
        : pick(locale, { sv: "Kunde inte uppdatera standardprofil", ar: "تعذر تحديث الملف الافتراضي", fi: "Oletusprofiilin päivitys epäonnistui", bcs: "Ažuriranje nije uspjelo", en: "Could not update default profile" })
    );
    if (res.ok) load();
  }

  return (
    <section className="space-y-3">
      <form action={onCreate} className="card grid gap-2 p-4 md:grid-cols-4">
        <input name="city" placeholder={pick(locale, { sv: "Stad", ar: "المدينة", fi: "Kaupunki", bcs: "Grad", en: "City" })} className="rounded-xl border p-2" required />
        <input name="price_max" type="number" placeholder={pick(locale, { sv: "Pris max", ar: "أعلى سعر", fi: "Hinta max", bcs: "Max cijena", en: "Price max" })} className="rounded-xl border p-2" />
        <input name="monthly_cost_max" type="number" placeholder={pick(locale, { sv: "Månad max", ar: "الشهرية max", fi: "Kuukausi max", bcs: "Mjesečno max", en: "Monthly max" })} className="rounded-xl border p-2" />
        <button className="button-primary">{pick(locale, { sv: "Spara bevakning", ar: "حفظ التنبيه", fi: "Tallenna hälytys", bcs: "Sačuvaj alarm", en: "Save alert profile" })}</button>
      </form>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      <div className="space-y-2">
        {profiles.map((profile) => (
          <article key={profile.id} className="card p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{profile.city}</p>
              {profile.is_default ? (
                <span className="rounded-full bg-[#eef4ff] px-2 py-1 text-xs font-semibold text-[#274690]">
                  {pick(locale, { sv: "Standard", ar: "افتراضي", fi: "Oletus", bcs: "Podrazumijevano", en: "Default" })}
                </span>
              ) : (
                <button type="button" className="button-secondary px-3 py-1 text-xs" onClick={() => onSetDefault(profile.id)}>
                  {pick(locale, { sv: "Sätt som standard", ar: "اجعله افتراضيًا", fi: "Aseta oletukseksi", bcs: "Postavi kao zadano", en: "Set as default" })}
                </button>
              )}
            </div>
            <p className="text-slate-600">{pick(locale, { sv: "Pris max", ar: "أعلى سعر", fi: "Hinta max", bcs: "Max cijena", en: "Price max" })}: {profile.price_max ?? "-"}</p>
            <p className="text-slate-600">{pick(locale, { sv: "Månad max", ar: "الشهرية max", fi: "Kuukausi max", bcs: "Mjesečno max", en: "Monthly max" })}: {profile.monthly_cost_max ?? "-"}</p>
          </article>
        ))}
        {profiles.length === 0 ? <p className="card p-4 text-sm text-slate-600">{pick(locale, { sv: "Inga sökprofiler än.", ar: "لا توجد ملفات بحث بعد.", fi: "Ei hakuprofiileja vielä.", bcs: "Još nema profila pretrage.", en: "No search profiles yet." })}</p> : null}
      </div>
    </section>
  );
}
