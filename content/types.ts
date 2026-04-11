export type PhotoCategory =
  | "Portrait"
  | "Street"
  | "Editorial"
  | "B&W"
  | "Fashion"
  | "Landscape"
  | "Events";

export interface Photo {
  _id: string;
  title: string;
  category: PhotoCategory;
  featured: boolean;
  order: number;
  imageUrl: string;
  width: number;
  height: number;
  description?: string;
}

export interface Slide {
  id: string;
  sortOrder: number;
  mediaType: "photo" | "video";
  url: string;
  caption?: string;
  active: boolean;
}

export interface Album {
  _id: string;
  title: string;
  category: PhotoCategory;
  coverUrl: string;
  photoCount: number;
  photos: Photo[];
}

export interface Publication {
  name: string;
  issue: string;
  url?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  heroCategories: string;
  email: string;
  instagram: string;
  behance?: string;
  heroImageUrl: string;
  profileImageUrl: string;
  /** Paragraphs shown on About when present */
  bio: string[];
  stats: Stat[];
  publications: Publication[];
}
