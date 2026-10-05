import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/crew", label: "The Crew" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100/80 bg-sand-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ocean-900 transition hover:text-ocean-600 sm:text-3xl"
        >
          Fun Souls
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ocean-700 transition hover:bg-ocean-100 hover:text-ocean-900 sm:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
