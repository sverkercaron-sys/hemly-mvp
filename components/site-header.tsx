import Image from "next/image";
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
    <header className="sticky top-0 z-30 border-b border-[#ececf1] bg-white/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/brand/hemly-icon-ink.svg" alt="Hemly icon" width={36} height={36} className="h-9 w-9 rounded-lg" priority />
          <Image
            src="/brand/hemly-wordmark-transparent-dark.svg"
            alt="Hemly"
            width={196}
            height={58}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-[#1d1d1f] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-1.5 transition hover:bg-[#f3f3f6]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/dashboard/agent" className="button-primary">
            Add Listing
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-semibold md:hidden">
          <Link href="/bostader" className="button-secondary px-3 py-1.5">
            Homes
          </Link>
          <Link href="/map" className="button-secondary px-3 py-1.5">
            Map
          </Link>
        </nav>
      </div>
    </header>
  );
}
