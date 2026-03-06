import Link from "next/link";
import { Home, Calculator, MapPinned } from "lucide-react";

const actions = [
  {
    href: "/bostader",
    title: "Search homes",
    description: "Filter by city, area, price, monthly cost, rooms, and size.",
    icon: Home
  },
  {
    href: "/affordability",
    title: "See what I can afford",
    description: "3-step affordability calculator with max price and monthly payment.",
    icon: Calculator
  },
  {
    href: "/map",
    title: "Explore map",
    description: "Browse homes by location with pricing and cluster pins.",
    icon: MapPinned
  }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="card p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Hemly</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Find a home that matches your life and budget</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Search with traditional filters, compare monthly costs, save favorites, and discover neighborhoods on the map.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="card group block p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <Icon className="h-7 w-7 text-teal-700" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-teal-700">Open</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
