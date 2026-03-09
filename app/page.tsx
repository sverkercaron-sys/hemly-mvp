import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Home, MapPinned } from "lucide-react";

const actions = [
  {
    href: "/bostader",
    title: "Search homes",
    description: "Traditional filters with monthly-cost mode.",
    icon: Home
  },
  {
    href: "/affordability",
    title: "See what I can afford",
    description: "Three-step affordability in under one minute.",
    icon: Calculator
  },
  {
    href: "/map",
    title: "Explore map",
    description: "Clustered map with instant property previews.",
    icon: MapPinned
  }
];

const stats = [
  { label: "Listings", value: "300+" },
  { label: "Cities", value: "4" },
  { label: "Search modes", value: "2" },
  { label: "Moderation", value: "100%" }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="soft-panel overflow-hidden p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <span className="eyebrow-chip">Hemly Marketplace</span>
            <h1 className="section-title">Find a home with confidence, speed, and affordability clarity.</h1>
            <p className="max-w-2xl text-base text-[var(--muted)] sm:text-lg">
              Hemly combines beautiful search UX, affordability intelligence, map exploration, and moderated listings in one premium marketplace.
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

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="card p-4">
                <p className="kicker">{stat.label}</p>
                <p className="mt-1 text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="card block p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="inline-flex rounded-xl border border-[#e2d5c6] bg-[#fff7ef] p-3">
              <Icon className="h-6 w-6 text-[#5f3b2c]" />
            </div>
            <h2 className="mt-4 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-[#6b3f2b]">
              Open <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="card grid gap-5 p-6 sm:grid-cols-[1fr_1.2fr] sm:p-8">
        <div className="space-y-3">
          <p className="kicker">Brand</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Designed for premium real estate experiences.
          </h3>
          <p className="text-sm text-[var(--muted)]">Clean hierarchy, calm contrast, and clear actions built for trust from first view.</p>
        </div>
        <div className="flex items-center justify-start sm:justify-end">
          <Image src="/brand/hemly-icon-sand.svg" alt="Hemly mark" width={180} height={180} className="h-28 w-28 sm:h-36 sm:w-36" />
        </div>
      </div>
    </section>
  );
}
