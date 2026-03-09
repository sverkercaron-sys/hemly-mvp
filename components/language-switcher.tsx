"use client";

import { LOCALE_COOKIE, Locale, pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

const options: Array<{ value: Locale; label: string }> = [
  { value: "sv", label: "Svenska" },
  { value: "ar", label: "العربية" },
  { value: "fi", label: "Suomi" },
  { value: "bcs", label: "Bos/Cr/Srb" },
  { value: "en", label: "English" }
];

export function LanguageSwitcher() {
  const locale = useLocale();

  return (
    <label className="hidden items-center gap-2 text-xs font-semibold text-[#6e6e73] lg:flex">
      {pick(locale, { sv: "Språk", ar: "اللغة", fi: "Kieli", bcs: "Jezik", en: "Language" })}
      <select
        className="rounded-lg border border-[#e5e5ea] bg-white px-2 py-1 text-xs"
        defaultValue={locale}
        onChange={(e) => {
          const value = e.target.value as Locale;
          document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
          window.location.reload();
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
