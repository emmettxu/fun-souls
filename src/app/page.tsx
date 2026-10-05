import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TripCard, MemberCard } from "@/components/Cards";
import {
  getSiteConfig,
  getFeaturedTrip,
  getAllTripMetas,
  getAllMemberMetas,
} from "@/lib/content";

export default function HomePage() {
  const { tagline } = getSiteConfig();
  const featuredTrip = getFeaturedTrip();
  const trips = getAllTripMetas();
  const members = getAllMemberMetas();

  const heroImages =
    featuredTrip?.heroImages.map((image, i) => ({
      src: image.src,
      focus: image.focus,
      alt: `${featuredTrip.title} — photo ${i + 1}`,
    })) ?? [];

  return (
    <>
      <HeroCarousel images={heroImages} />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-ocean-900 sm:text-6xl">
            Fun Souls
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ocean-700">{tagline}</p>
        </div>

        {featuredTrip && (
          <div className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-coral-500">
                  Featured trip
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
                  {featuredTrip.title}
                </h2>
              </div>
              <Link
                href={`/trips/${featuredTrip.slug}`}
                className="shrink-0 rounded-full bg-ocean-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-ocean-700"
              >
                View trip
              </Link>
            </div>
            <TripCard trip={featuredTrip} />
          </div>
        )}

        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-coral-500">
                The crew
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
                Eleven souls, one adventure
              </h2>
            </div>
            <Link
              href="/crew"
              className="shrink-0 text-sm font-medium text-ocean-600 hover:text-ocean-800"
            >
              Meet everyone →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {members.slice(0, 6).map((member) => (
              <MemberCard key={member.slug} member={member} />
            ))}
          </div>
        </div>

        {trips.length > 1 && (
          <div className="mt-16">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
              All trips
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {trips.map((trip) => (
                <TripCard key={trip.slug} trip={trip} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
