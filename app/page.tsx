import Link from "next/link";
import { ArrowRight, Calculator, Home, MapPinned, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const actions = [
  {
    href: "/bostader",
    title: "Search homes",
    description: "Traditional filters with monthly cost mode.",
    icon: Home
  },
  {
    href: "/affordability",
    title: "See what I can afford",
    description: "3-step affordability flow with instant result.",
    icon: Calculator
  },
  {
    href: "/map",
    title: "Explore map",
    description: "Clustered map view with fast property drill-down.",
    icon: MapPinned
  }
];

const stats = [
  { label: "Active listings", value: "300+" },
  { label: "Cities covered", value: "4" },
  { label: "Avg. lead speed", value: "< 2 min" },
  { label: "Moderation status", value: "Admin-gated" }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="soft-panel overflow-hidden p-6 sm:p-10">
        <div className="hero-grid items-end">
          <div className="space-y-5">
            <p className="kicker">Hemly Marketplace</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              A modern housing marketplace built for affordability and speed.
            </h1>
            <p className="max-w-2xl text-base text-slate-700 sm:text-lg">
              Hemly combines classic search, monthly-cost affordability, map intelligence, and agent workflows in one production-ready platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/bostader" className="button-primary px-6 py-3 text-base">
                Explore Listings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/affordability" className="button-secondary px-6 py-3 text-base">
                Start Affordability
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-chip">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="card group block p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="inline-flex rounded-xl bg-emerald-50 p-3">
              <Icon className="h-6 w-6 text-teal-700" />
            </div>
            <h2 className="mt-4 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-teal-700">
              Open flow <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <Sparkles className="h-5 w-5 text-teal-700" />
          <p className="mt-3 text-sm font-bold uppercase tracking-wide text-slate-500">User Value</p>
          <p className="mt-2 text-lg font-bold">Switch between price and monthly cost in one search flow.</p>
        </div>
        <div className="card p-5">
          <TrendingUp className="h-5 w-5 text-teal-700" />
          <p className="mt-3 text-sm font-bold uppercase tracking-wide text-slate-500">Agent Value</p>
          <p className="mt-2 text-lg font-bold">Manual listing, import adapters, and lead capture in one dashboard.</p>
        </div>
        <div className="card p-5">
          <ShieldCheck className="h-5 w-5 text-teal-700" />
          <p className="mt-3 text-sm font-bold uppercase tracking-wide text-slate-500">Admin Control</p>
          <p className="mt-2 text-lg font-bold">All listings pass moderation before they go live.</p>
        </div>
      </div>
    </section>
  );
}
