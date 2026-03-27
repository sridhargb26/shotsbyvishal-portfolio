import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

// ── QUERIES ──

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    name, tagline, bio, email, instagram, behance,
    heroImage, profileImage,
    publications[]{ name, issue, url },
    stats[]{ value, label }
  }`);
}

export async function getPhotos(category?: string) {
  const filter = category && category !== "All"
    ? `&& category == "${category}"`
    : "";
  return client.fetch(`*[_type == "photo" ${filter}] | order(order asc, _createdAt desc){
    _id, title, category, featured,
    "imageUrl": image.asset->url,
    "blurUrl": image.asset->metadata.lqip,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
  }`);
}

export async function getFeaturedPhotos() {
  return client.fetch(`*[_type == "photo" && featured == true] | order(order asc)[0...6]{
    _id, title, category,
    "imageUrl": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
  }`);
}
