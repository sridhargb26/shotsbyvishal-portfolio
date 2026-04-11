import { getSiteSettings, getFeaturedPhotos } from "@/lib/content";
import HomeClient from "@/components/HomeClient";

export const revalidate =
  Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "") || undefined;

export default async function Home() {
  const settings = getSiteSettings();
  const featured = await getFeaturedPhotos();
  return <HomeClient settings={settings} featured={featured} />;
}
