import type { Metadata } from "next";
import { TripCard } from "@/components/Cards";
import { getAllTripMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Trips",
  description: "All travel adventures documented on Fun Souls.",
};

export default function TripsPage() {
  const trips = getAllTripMetas();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-coral-500">Archive</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ocean-900">
          Trips
        </h1>
        <p className="mt-3 text-lg text-ocean-700">
          Every journey gets its own chapter — photos, stories, and memories kept
          separate so nothing gets lost.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.slug} trip={trip} />
        ))}
      </div>
    </div>
  );
}
