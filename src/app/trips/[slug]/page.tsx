import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownText } from "@/components/MarkdownText";
import { PhotoGallery } from "@/components/PhotoGallery";
import {
  formatDateRange,
  getAllTripMetas,
  getTrip,
  getAllMemberMetas,
} from "@/lib/content";

interface TripPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTripMetas().map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) return { title: "Trip not found" };

  return {
    title: trip.title,
    description: trip.description,
    openGraph: {
      title: trip.title,
      description: trip.description,
      images: [trip.coverImage],
    },
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  const members = getAllMemberMetas();
  const participants = members.filter((m) => trip.participants.includes(m.slug));

  return (
    <div>
      <div className="relative aspect-[21/9] min-h-[220px] w-full bg-ocean-900">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          priority
          className="object-cover opacity-90"
          style={{ objectPosition: trip.coverFocus ?? "center center" }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-ocean-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-ocean-100">
            {formatDateRange(trip.startDate, trip.endDate)} · {trip.location}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white sm:text-5xl">
            {trip.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            {trip.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {trip.overview && (
          <section className="mb-14">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
              Overview
            </h2>
            <div className="mt-4">
              <MarkdownText content={trip.overview} />
            </div>
          </section>
        )}

        {participants.length > 0 && (
          <section className="mb-14">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
              Who went
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {participants.map((member) => (
                <Link
                  key={member.slug}
                  href={`/crew/${member.slug}`}
                  className="rounded-full border border-ocean-200 bg-white px-4 py-1.5 text-sm font-medium text-ocean-700 transition hover:border-ocean-400 hover:text-ocean-900"
                >
                  {member.alias}
                  {member.displayName ? ` (${member.displayName})` : ""}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
            Gallery
          </h2>
          <div className="mt-6">
            <PhotoGallery groups={trip.galleryGroups} />
          </div>
        </section>
      </div>
    </div>
  );
}
