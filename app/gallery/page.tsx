import { getPhotos } from "@/sanity/lib/client";
import GalleryClient from "@/components/GalleryClient";

export const revalidate = 60;

export default async function GalleryPage() {
  const photos = await getPhotos();
  return <GalleryClient initialPhotos={photos || []} />;
}
