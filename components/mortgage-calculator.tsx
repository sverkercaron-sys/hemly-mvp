"use client";

import { useMemo, useState } from "react";
import { estimateMonthlyCost, formatMonthly, formatSEK } from "@/lib/utils";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

export function MortgageCalculator({ homePrice, monthlyFee }: { homePrice: number; monthlyFee: number }) {
  const [interestRate, setInterestRate] = useState(4);
  const [years, setYears] = useState(30);
  const locale = useLocale();

  const monthly = useMemo(() => {
    return estimateMonthlyCost(homePrice, monthlyFee, interestRate / 100, years);
  }, [homePrice, monthlyFee, interestRate, years]);

  return (
    <section className="card space-y-4 p-5">
      <p className="kicker">{pick(locale, { sv: "Bolån", ar: "الرهن", fi: "Asuntolaina", bcs: "Hipoteka", en: "Mortgage" })}</p>
      <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        {pick(locale, { sv: "Månadskostnadskalkyl", ar: "حاسبة التكلفة الشهرية", fi: "Kuukausikustannuslaskuri", bcs: "Kalkulator mjesečnih troškova", en: "Monthly estimate calculator" })}
      </h3>
      <p className="text-sm text-[var(--muted)]">{pick(locale, { sv: "Pris", ar: "السعر", fi: "Hinta", bcs: "Cijena", en: "Price" })} {formatSEK(homePrice)} • {pick(locale, { sv: "Avgift", ar: "الرسوم", fi: "Maksu", bcs: "Naknada", en: "Fee" })} {formatSEK(monthlyFee)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-[#3b322c]">
          {pick(locale, { sv: "Ränta (%)", ar: "الفائدة (%)", fi: "Korko (%)", bcs: "Kamata (%)", en: "Interest rate (%)" })}
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="input-shell" />
        </label>
        <label className="space-y-1 text-sm font-semibold text-[#3b322c]">
          {pick(locale, { sv: "Amortering år", ar: "مدة القرض", fi: "Laina-aika", bcs: "Trajanje", en: "Amortization years" })}
          <input type="number" min={5} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="input-shell" />
        </label>
      </div>
      <p className="text-base font-bold text-[#2f2722]">{formatMonthly(monthly)}</p>
    </section>
  );
}
