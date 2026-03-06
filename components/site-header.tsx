import Link from "next/link";

const links = [
  { href: "/bostader", label: "Homes" },
  { href: "/map", label: "Map" },
  { href: "/affordability", label: "Affordability" },
  { href: "/favorites", label: "Favorites" },
  { href: "/dashboard/agent", label: "Agent" },
  { href: "/dashboard/admin", label: "Admin" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black tracking-tight text-teal-800">
          HEMLY
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
