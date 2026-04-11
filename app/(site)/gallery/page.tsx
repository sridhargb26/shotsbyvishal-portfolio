import { getAlbums } from "@/lib/content";
import GalleryClient from "@/components/GalleryClient";

export const revalidate =
  Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "") || undefined;

export default async function GalleryPage() {
  const albums = await getAlbums();
  return <GalleryClient albums={albums} />;
}
