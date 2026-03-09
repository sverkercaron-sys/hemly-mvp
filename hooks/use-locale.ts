"use client";

import { useMemo } from "react";
import { LOCALE_COOKIE, Locale, normalizeLocale } from "@/lib/i18n";

export function useLocale(): Locale {
  return useMemo(() => {
    if (typeof document === "undefined") return "sv";
    const match = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${LOCALE_COOKIE}=`));

    const value = match ? decodeURIComponent(match.split("=")[1]) : "sv";
    return normalizeLocale(value);
  }, []);
}
