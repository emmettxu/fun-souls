import type { MemberVideo } from "@/lib/types";

function VideoPlayer({ video }: { video: MemberVideo }) {
  if (video.kind === "youtube" || video.kind === "vimeo") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={video.embedUrl}
          title="Member video"
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      src={video.src}
      controls
      playsInline
      preload="metadata"
      className="w-full rounded-xl bg-black"
    />
  );
}

export function MemberVideos({ videos }: { videos: MemberVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-ocean-900">
        Videos
      </h2>
      <div className="mt-6 space-y-4">
        {videos.map((video, i) => (
          <VideoPlayer key={`${video.kind}-${i}`} video={video} />
        ))}
      </div>
    </section>
  );
}
