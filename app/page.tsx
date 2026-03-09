import Link from "next/link";
import { ArrowRight, Calculator, Home, MapPinned } from "lucide-react";

const actions = [
  {
    href: "/bostader",
    title: "Search homes",
    description: "Filter by city, area, size, rooms, price or monthly cost.",
    icon: Home
  },
  {
    href: "/affordability",
    title: "Affordability",
    description: "Understand purchasing power in three simple steps.",
    icon: Calculator
  },
  {
    href: "/map",
    title: "Map discovery",
    description: "Scan neighborhoods visually with clustered price points.",
    icon: MapPinned
  }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="soft-panel overflow-hidden p-7 sm:p-12">
        <div className="max-w-4xl space-y-6">
          <span className="eyebrow-chip">Hemly Marketplace</span>
          <h1 className="section-title text-4xl sm:text-6xl">Find your next home with clarity.</h1>
          <p className="max-w-3xl text-base text-[var(--muted)] sm:text-xl">
            A premium property marketplace with modern search, monthly affordability insights, map exploration, and trusted listing moderation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/bostader" className="button-primary px-6 py-3">
              Explore Listings <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/affordability" className="button-secondary px-6 py-3">
              Start Affordability
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="card block p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <Icon className="h-6 w-6 text-[var(--terra)]" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#1d1d1f]">
              Open <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
