import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatSEK(value: number) {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value) + " kr";
}

export function formatMonthly(value: number) {
  return "≈ " + new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value) + " kr / month";
}

export function estimateMonthlyCost(price: number, monthlyFee = 0, interestRate = 0.04, years = 30, operatingCost = 0) {
  const principal = price * 0.85;
  const monthlyRate = interestRate / 12;
  const totalMonths = years * 12;
  const mortgageCost =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(mortgageCost + monthlyFee + operatingCost);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
