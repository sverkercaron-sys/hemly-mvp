export const SUPPORTED_LOCALES = ["sv", "ar", "fi", "bcs", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_COOKIE = "hemly_locale";

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return "sv";
  const lower = value.toLowerCase();
  if (isLocale(lower)) return lower;
  if (lower.startsWith("ar")) return "ar";
  if (lower.startsWith("fi")) return "fi";
  if (lower.startsWith("en")) return "en";
  if (["bs", "hr", "sr", "sr-latn", "hr-hr", "bs-ba"].includes(lower)) return "bcs";
  return "sv";
}

export async function getServerLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const cookieLocale = normalizeLocale(store.get(LOCALE_COOKIE)?.value);
  return cookieLocale;
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function pick<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale] ?? values.sv;
}
