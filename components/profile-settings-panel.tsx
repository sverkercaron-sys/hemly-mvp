"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

interface UserProfile {
  language: "sv" | "ar" | "fi" | "bcs" | "en";
  monthly_income: number | null;
  savings: number | null;
  preferred_down_payment: number | null;
}

const languages: Array<{ value: UserProfile["language"]; label: string }> = [
  { value: "sv", label: "Svenska" },
  { value: "ar", label: "العربية" },
  { value: "fi", label: "Suomi" },
  { value: "bcs", label: "Bos/Cr/Srb" },
  { value: "en", label: "English" }
];

export function ProfileSettingsPanel() {
  const locale = useLocale();
  const [form, setForm] = useState<UserProfile>({
    language: "sv",
    monthly_income: null,
    savings: null,
    preferred_down_payment: null
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ profile: null })))
      .then((data) => {
        if (!data?.profile) return;
        setForm({
          language: data.profile.language ?? "sv",
          monthly_income: data.profile.monthly_income ?? null,
          savings: data.profile.savings ?? null,
          preferred_down_payment: data.profile.preferred_down_payment ?? null
        });
      });
  }, []);

  async function onSave() {
    setStatus(pick(locale, { sv: "Sparar...", ar: "جارٍ الحفظ...", fi: "Tallennetaan...", bcs: "Spremanje...", en: "Saving..." }));
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setStatus(
      res.ok
        ? pick(locale, { sv: "Sparat", ar: "تم الحفظ", fi: "Tallennettu", bcs: "Sačuvano", en: "Saved" })
        : pick(locale, { sv: "Kunde inte spara", ar: "تعذر الحفظ", fi: "Tallennus epäonnistui", bcs: "Nije sačuvano", en: "Could not save" })
    );
    if (res.ok && typeof document !== "undefined") {
      document.cookie = `hemly_locale=${form.language}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  return (
    <section className="card grid gap-3 p-5 md:grid-cols-2">
      <label className="space-y-1 text-sm font-semibold">
        {pick(locale, { sv: "Språk", ar: "اللغة", fi: "Kieli", bcs: "Jezik", en: "Language" })}
        <select
          value={form.language}
          onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value as UserProfile["language"] }))}
          className="input-shell"
        >
          {languages.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm font-semibold">
        {pick(locale, { sv: "Månadsinkomst (kr)", ar: "الدخل الشهري", fi: "Kuukausitulot", bcs: "Mjesečni prihod", en: "Monthly income (SEK)" })}
        <input
          className="input-shell"
          type="number"
          value={form.monthly_income ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, monthly_income: e.target.value ? Number(e.target.value) : null }))}
        />
      </label>

      <label className="space-y-1 text-sm font-semibold">
        {pick(locale, { sv: "Totalt sparande (kr)", ar: "إجمالي المدخرات", fi: "Säästöt yhteensä", bcs: "Ukupna štednja", en: "Total savings (SEK)" })}
        <input className="input-shell" type="number" value={form.savings ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, savings: e.target.value ? Number(e.target.value) : null }))} />
      </label>

      <label className="space-y-1 text-sm font-semibold">
        {pick(locale, {
          sv: "Önskad kontantinsats att använda (kr)",
          ar: "الدفعة المقدمة التي تريد استخدامها",
          fi: "Haluttu käsiraha (SEK)",
          bcs: "Željeni ulog za učešće",
          en: "Preferred down payment to use (SEK)"
        })}
        <input
          className="input-shell"
          type="number"
          value={form.preferred_down_payment ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, preferred_down_payment: e.target.value ? Number(e.target.value) : null }))}
        />
      </label>

      <div className="md:col-span-2 flex items-center gap-3">
        <button type="button" className="button-primary" onClick={onSave}>
          {pick(locale, { sv: "Spara profil", ar: "حفظ الملف", fi: "Tallenna profiili", bcs: "Sačuvaj profil", en: "Save profile" })}
        </button>
        <p className="text-sm text-[var(--muted)]">{status}</p>
      </div>
    </section>
  );
}

