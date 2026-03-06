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
    <section className="card max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">What can I afford?</h1>
      <p className="text-sm text-slate-600">Step {step} of 3</p>

      {step === 1 ? (
        <label className="space-y-2 text-sm">
          <span>Monthly income (SEK)</span>
          <input type="number" className="w-full rounded-xl border p-2" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 2 ? (
        <label className="space-y-2 text-sm">
          <span>Savings for down payment (SEK)</span>
          <input type="number" className="w-full rounded-xl border p-2" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
        </label>
      ) : null}

      {step === 3 ? (
        <div className="space-y-2 rounded-xl bg-teal-50 p-4">
          <p className="text-sm text-slate-700">Estimated maximum home price</p>
          <p className="text-3xl font-bold text-teal-800">{formatSEK(result.maxHomePrice)}</p>
          <p className="text-sm font-medium text-slate-700">Estimated monthly payment {formatMonthly(result.monthlyPayment)}</p>
          <div className="flex gap-2 text-sm">
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
