import Image from "next/image";
import Link from "next/link";
import type { MemberMeta, TripMeta } from "@/lib/types";
import { formatDateRange } from "@/lib/content";

export function TripCard({ trip }: { trip: TripMeta }) {
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ocean-100">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          style={{ objectPosition: trip.coverFocus ?? "center center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ocean-500">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ocean-900">
          {trip.title}
        </h3>
        <p className="mt-1 text-sm text-ocean-600">{trip.location}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ocean-700">
          {trip.description}
        </p>
      </div>
    </Link>
  );
}

export function MemberCard({ member }: { member: MemberMeta }) {
  const title = member.displayName ?? member.alias;

  return (
    <Link
      href={`/crew/${member.slug}`}
      className="group flex flex-col items-center rounded-2xl border border-ocean-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-ocean-100 transition group-hover:ring-ocean-300">
        <Image
          src={member.avatar}
          alt={`${title} avatar`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg text-ocean-900">
        {member.alias}
      </h3>
      {member.displayName && (
        <p className="text-sm text-ocean-500">{member.displayName}</p>
      )}
      {member.tagline && (
        <p className="mt-2 line-clamp-2 text-sm text-ocean-600">{member.tagline}</p>
      )}
    </Link>
  );
}
