import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownText } from "@/components/MarkdownText";
import { MemberVideos } from "@/components/MemberVideos";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getAllMemberMetas, getMember } from "@/lib/content";

interface MemberPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllMemberMetas().map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) return { title: "Member not found" };

  const title = member.displayName ?? member.alias;

  return {
    title: member.alias,
    description: member.tagline ?? `${title} — member of Fun Souls.`,
    openGraph: {
      title: member.alias,
      description: member.tagline,
      images: [member.avatar],
    },
  };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full ring-4 ring-ocean-100">
          <Image
            src={member.avatar}
            alt={`${member.alias} avatar`}
            fill
            className="object-cover"
            sizes="144px"
            priority
          />
        </div>
        <div className="mt-6 sm:mt-2">
          <p className="text-sm font-medium uppercase tracking-wider text-coral-500">
            Crew member
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ocean-900">
            {member.alias}
          </h1>
          {member.displayName && (
            <p className="mt-1 text-lg text-ocean-600">{member.displayName}</p>
          )}
          {member.tagline && (
            <p className="mt-3 max-w-xl text-ocean-700">{member.tagline}</p>
          )}
        </div>
      </div>

      {member.bio && (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
            About
          </h2>
          <div className="mt-4">
            <MarkdownText content={member.bio} />
          </div>
        </section>
      )}

      <MemberVideos videos={member.videos} />

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
          Photos
        </h2>
        <div className="mt-6">
          <PhotoGallery
            groups={
              member.photos.length > 0
                ? [{ name: "Gallery", photos: member.photos }]
                : []
            }
          />
        </div>
      </section>
    </div>
  );
}
