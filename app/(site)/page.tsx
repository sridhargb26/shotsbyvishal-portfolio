import { getSiteSettings, getHomepageSlides } from "@/lib/content";
import HomeClient from "@/components/HomeClient";

export const revalidate =
  Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "") || undefined;

export default async function Home() {
  const settings = getSiteSettings();
  const slides = await getHomepageSlides();
  return <HomeClient settings={settings} slides={slides} />;
}
