import type { Metadata } from "next";
import { MemberCard } from "@/components/Cards";
import { getAllMemberMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Crew",
  description: "Meet the travelers behind Fun Souls.",
};

export default function CrewPage() {
  const members = getAllMemberMetas();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-coral-500">
          The crew
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ocean-900">
          Eleven souls
        </h1>
        <p className="mt-3 text-lg text-ocean-700">
          Friends who show up for the flights, the ferry rides, and everything
          in between.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.slug} member={member} />
        ))}
      </div>
    </div>
  );
}
