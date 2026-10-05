import type { MemberVideo } from "./types";

export function parseExternalVideo(url: string): MemberVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (youtubeMatch) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { kind: "file", src: trimmed };
  }

  return null;
}
