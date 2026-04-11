import { getPhotos } from "@/lib/content";
import GalleryClient from "@/components/GalleryClient";

/** When set (e.g. 120), gallery revalidates so Cloudinary uploads appear without redeploy. */
export const revalidate =
  Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "") || undefined;

export default async function GalleryPage() {
  const photos = await getPhotos();
  return <GalleryClient initialPhotos={photos} />;
}
