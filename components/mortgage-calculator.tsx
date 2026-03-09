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
    <section className="card space-y-4 p-5">
      <p className="kicker">Mortgage</p>
      <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Monthly estimate calculator
      </h3>
      <p className="text-sm text-[var(--muted)]">Price {formatSEK(homePrice)} and monthly fee {formatSEK(monthlyFee)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-[#3b322c]">
          Interest rate (%)
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="input-shell" />
        </label>
        <label className="space-y-1 text-sm font-semibold text-[#3b322c]">
          Amortization years
          <input type="number" min={5} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="input-shell" />
        </label>
      </div>
      <p className="text-base font-bold text-[#2f2722]">{formatMonthly(monthly)}</p>
    </section>
  );
}
