import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import type {
  GalleryGroup,
  HeroImage,
  Member,
  MemberMeta,
  MemberVideo,
  Photo,
  SiteConfig,
  Trip,
  TripMeta,
} from "./types";
import { parseExternalVideo } from "./parse-video-url";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".svg",
]);

function readYaml<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return yaml.load(raw) as T;
}

function readMarkdownBody(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw).content.trim();
}

function isImageFile(name: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function toPublicPath(absolutePath: string): string {
  const relative = path.relative(PUBLIC_DIR, absolutePath);
  return `/${relative.split(path.sep).join("/")}`;
}

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);

function isVideoFile(name: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function isAvatarFile(name: string): boolean {
  return /^avatar\./i.test(name);
}

function scanPhotos(dir: string, prefix: string): Photo[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => isImageFile(name) && !isAvatarFile(name))
    .sort()
    .map((filename) => {
      const src = toPublicPath(path.join(dir, filename));
      const alt = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      return { src, alt: `${prefix} — ${alt}` };
    });
}

function scanLocalVideos(dir: string): MemberVideo[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(isVideoFile)
    .sort()
    .map((filename) => ({
      kind: "local" as const,
      src: toPublicPath(path.join(dir, filename)),
    }));
}

function parseExternalVideos(raw: string[] | undefined): MemberVideo[] {
  if (!raw?.length) return [];

  return raw
    .map(parseExternalVideo)
    .filter((video): video is MemberVideo => video !== null);
}

function scanGalleryGroups(galleryDir: string, tripTitle: string): GalleryGroup[] {
  if (!fs.existsSync(galleryDir)) return [];

  const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());
  const rootPhotos = scanPhotos(galleryDir, tripTitle);

  if (subdirs.length === 0) {
    if (rootPhotos.length === 0) return [];
    return [{ name: "Gallery", photos: rootPhotos }];
  }

  const groups: GalleryGroup[] = subdirs
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((subdir) => ({
      name: subdir.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      photos: scanPhotos(path.join(galleryDir, subdir.name), tripTitle),
    }))
    .filter((group) => group.photos.length > 0);

  if (rootPhotos.length > 0) {
    groups.unshift({ name: "General", photos: rootPhotos });
  }

  return groups;
}

export function getSiteConfig(): SiteConfig {
  return readYaml<SiteConfig>(path.join(CONTENT_DIR, "site.yaml"));
}

function normalizeHeroImages(raw: Array<string | HeroImage>): HeroImage[] {
  return raw.map((item) => (typeof item === "string" ? { src: item } : item));
}

function readTripMeta(slug: string): TripMeta {
  const tripYaml = readYaml<Omit<TripMeta, "slug"> & { heroImages: Array<string | HeroImage> }>(
    path.join(CONTENT_DIR, "trips", slug, "trip.yaml"),
  );
  return {
    slug,
    ...tripYaml,
    heroImages: normalizeHeroImages(tripYaml.heroImages),
  };
}

export function getAllTripMetas(): TripMeta[] {
  const indexPath = path.join(CONTENT_DIR, "trips", "index.yaml");
  const slugs = readYaml<string[]>(indexPath);
  return slugs.map((slug) => readTripMeta(slug));
}

export function getTrip(slug: string): Trip | null {
  const tripDir = path.join(CONTENT_DIR, "trips", slug);
  if (!fs.existsSync(tripDir)) return null;

  const meta = readTripMeta(slug);
  const overview = readMarkdownBody(path.join(tripDir, "overview.md"));
  const galleryGroups = scanGalleryGroups(
    path.join(PUBLIC_DIR, "photos", "trips", slug, "gallery"),
    meta.title,
  );

  return {
    ...meta,
    overview,
    galleryGroups,
  };
}

export function getFeaturedTrip(): Trip | null {
  const { featuredTrip } = getSiteConfig();
  return getTrip(featuredTrip);
}

export function getAllMemberMetas(): MemberMeta[] {
  const indexPath = path.join(CONTENT_DIR, "members", "index.yaml");
  const slugs = readYaml<string[]>(indexPath);

  return slugs.map((slug) => {
    const memberYaml = readYaml<Omit<MemberMeta, "slug">>(
      path.join(CONTENT_DIR, "members", slug, "member.yaml"),
    );
    return { slug, ...memberYaml };
  });
}

export function getMember(slug: string): Member | null {
  const memberDir = path.join(CONTENT_DIR, "members", slug);
  if (!fs.existsSync(memberDir)) return null;

  const meta = readYaml<Omit<MemberMeta, "slug"> & { externalVideos?: string[] }>(
    path.join(memberDir, "member.yaml"),
  );
  const bio = readMarkdownBody(path.join(memberDir, "bio.md"));
  const photos = scanPhotos(
    path.join(PUBLIC_DIR, "photos", "members", slug),
    meta.displayName ?? meta.alias,
  );
  const localVideos = scanLocalVideos(
    path.join(PUBLIC_DIR, "videos", "members", slug),
  );
  const externalVideos = parseExternalVideos(meta.externalVideos);
  const { externalVideos: _, ...memberMeta } = meta;

  return {
    slug,
    ...memberMeta,
    bio,
    videos: [...localVideos, ...externalVideos],
    photos,
  };
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (start === end) {
    return startDate.toLocaleDateString("en-US", opts);
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startOpts: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }
    : opts;

  return `${startDate.toLocaleDateString("en-US", startOpts)} – ${endDate.toLocaleDateString("en-US", opts)}`;
}
