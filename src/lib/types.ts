export interface SiteConfig {
  featuredTrip: string;
  tagline: string;
}

export interface HeroImage {
  src: string;
  /** CSS object-position, e.g. "center 70%" — shifts crop when using object-cover */
  focus?: string;
}

export interface TripMeta {
  slug: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  /** CSS object-position for the trip card / banner cover */
  coverFocus?: string;
  heroImages: HeroImage[];
  participants: string[];
  description: string;
}

export interface Trip extends TripMeta {
  overview: string;
  galleryGroups: GalleryGroup[];
}

export interface GalleryGroup {
  name: string;
  photos: Photo[];
}

export interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

export interface MemberMeta {
  slug: string;
  alias: string;
  displayName?: string;
  tagline?: string;
  avatar: string;
}

export interface Member extends MemberMeta {
  bio: string;
  videos: MemberVideo[];
  photos: Photo[];
}

export type MemberVideo =
  | { kind: "local"; src: string }
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string };
