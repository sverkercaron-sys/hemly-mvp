"use client";

import { useMemo, useState } from "react";
import { formatMonthly, formatSEK } from "@/lib/utils";

export function AffordabilityWizard() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState(45000);
  const [savings, setSavings] = useState(350000);

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
      <p className="kicker">Affordability tool</p>
      <h1 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
        See what you can afford
      </h1>
      <p className="text-sm text-slate-600">Step {step} of 3</p>

      {step === 1 ? (
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Monthly income (SEK)
          <input type="number" className="input-shell" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 2 ? (
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Savings for down payment (SEK)
          <input type="number" className="input-shell" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 3 ? (
        <div className="soft-panel space-y-3 p-5">
          <p className="text-sm font-semibold text-slate-700">Estimated maximum home price</p>
          <p className="text-4xl font-black text-teal-900" style={{ fontFamily: "var(--font-display)" }}>
            {formatSEK(result.maxHomePrice)}
          </p>
          <p className="text-sm font-semibold text-slate-700">Estimated monthly payment {formatMonthly(result.monthlyPayment)}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <a className="button-primary" href={`/bostader?priceMax=${result.maxHomePrice}`}>
              Search by price
            </a>
            <a className="button-secondary" href={`/bostader?monthlyCostMax=${result.monthlyPayment}`}>
              Search by monthly cost
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="button-secondary" disabled={step === 1}>
          Back
        </button>
        <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="button-primary" disabled={step === 3}>
          Next
        </button>
      </div>
    </section>
  );
}
