"use client";

import { useMemo, useState } from "react";
import { formatMonthly, formatSEK } from "@/lib/utils";
import { pick } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";

export function AffordabilityWizard() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState(45000);
  const [savings, setSavings] = useState(350000);
  const locale = useLocale();

  const result = useMemo(() => {
    const safeMonthly = income * 0.35;
    const maxLoan = safeMonthly * 170;
    const maxHomePrice = maxLoan + savings;
    return {
      monthlyPayment: Math.round(safeMonthly),
      maxHomePrice: Math.round(maxHomePrice)
    };
  }, [income, savings]);

  return (
    <section className="card mx-auto max-w-3xl space-y-5 p-6 sm:p-8">
      <p className="kicker">{pick(locale, { sv: "Boendekalkyl", ar: "القدرة الشرائية", fi: "Budjetti", bcs: "Pristupačnost", en: "Affordability" })}</p>
      <h1 className="section-title">{pick(locale, { sv: "Se vad du har råd med", ar: "اعرف ما يمكنك تحمله", fi: "Katso mitä voit ostaa", bcs: "Pogledaj šta možeš priuštiti", en: "See what you can afford" })}</h1>
      <p className="text-sm text-[var(--muted)]">{pick(locale, { sv: "Steg", ar: "الخطوة", fi: "Vaihe", bcs: "Korak", en: "Step" })} {step} / 3</p>

      {step === 1 ? (
        <label className="space-y-2 text-sm font-semibold text-[#3b322c]">
          {pick(locale, { sv: "Månadsinkomst (SEK)", ar: "الدخل الشهري", fi: "Kuukausitulot", bcs: "Mjesečni prihod", en: "Monthly income (SEK)" })}
          <input type="number" className="input-shell" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 2 ? (
        <label className="space-y-2 text-sm font-semibold text-[#3b322c]">
          {pick(locale, { sv: "Sparkapital till kontantinsats (SEK)", ar: "المدخرات", fi: "Säästöt käsirahaan", bcs: "Ušteđevina", en: "Savings for down payment (SEK)" })}
          <input type="number" className="input-shell" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 3 ? (
        <div className="soft-panel space-y-3 p-5">
          <p className="text-sm font-semibold text-[var(--muted)]">{pick(locale, { sv: "Beräknat maxpris", ar: "أقصى سعر متوقع", fi: "Arvioitu enimmäishinta", bcs: "Procijenjena max cijena", en: "Estimated maximum home price" })}</p>
          <p className="text-5xl font-semibold tracking-tight text-[#1d1d1f]">{formatSEK(result.maxHomePrice)}</p>
          <p className="text-sm font-semibold text-[var(--muted)]">{pick(locale, { sv: "Beräknad månadskostnad", ar: "التكلفة الشهرية", fi: "Arvioitu kuukausikulu", bcs: "Procijenjeni mjesečni trošak", en: "Estimated monthly payment" })} {formatMonthly(result.monthlyPayment)}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <a className="button-primary" href={`/bostader?priceMax=${result.maxHomePrice}`}>
              {pick(locale, { sv: "Sök på pris", ar: "ابحث بالسعر", fi: "Hae hinnalla", bcs: "Pretraga po cijeni", en: "Search by price" })}
            </a>
            <a className="button-secondary" href={`/bostader?monthlyCostMax=${result.monthlyPayment}`}>
              {pick(locale, { sv: "Sök på månadskostnad", ar: "ابحث بالتكلفة الشهرية", fi: "Hae kuukausikululla", bcs: "Pretraga po mjesečnom trošku", en: "Search by monthly cost" })}
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="button-secondary" disabled={step === 1}>
          {pick(locale, { sv: "Tillbaka", ar: "رجوع", fi: "Takaisin", bcs: "Nazad", en: "Back" })}
        </button>
        <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="button-primary" disabled={step === 3}>
          {pick(locale, { sv: "Nästa", ar: "التالي", fi: "Seuraava", bcs: "Dalje", en: "Next" })}
        </button>
      </div>
    </section>
  );
}
