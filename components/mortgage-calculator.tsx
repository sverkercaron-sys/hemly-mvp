"use client";

import { useMemo, useState } from "react";
import { estimateMonthlyCost, formatMonthly, formatSEK } from "@/lib/utils";

export function MortgageCalculator({ homePrice, monthlyFee }: { homePrice: number; monthlyFee: number }) {
  const [interestRate, setInterestRate] = useState(4);
  const [years, setYears] = useState(30);

  const monthly = useMemo(() => {
    return estimateMonthlyCost(homePrice, monthlyFee, interestRate / 100, years);
  }, [homePrice, monthlyFee, interestRate, years]);

  return (
    <section className="card space-y-4 p-4">
      <h3 className="text-lg font-semibold">Mortgage calculator</h3>
      <p className="text-sm text-slate-600">Price {formatSEK(homePrice)} with monthly fee {formatSEK(monthlyFee)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Interest rate (%)</span>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full rounded-xl border p-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Amortization years</span>
          <input type="number" min={5} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-xl border p-2" />
        </label>
      </div>
      <p className="text-base font-semibold text-teal-700">{formatMonthly(monthly)}</p>
    </section>
  );
}
