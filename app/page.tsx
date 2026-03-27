import { getSiteSettings, getFeaturedPhotos } from "@/sanity/lib/client";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

export default async function Home() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedPhotos(),
  ]);

  // Fallback defaults if Sanity not yet configured
  const s = settings || {
    name: "Vishal Dey",
    tagline: "SHOTS BY\nVISHAL",
    heroCategories: "Editorial · Portrait · Street",
    email: "vishal@shotsbyvishal.com",
    instagram: "https://www.instagram.com/shotsbyvishal/",
  };

  return <HomeClient settings={s} featured={featured || []} />;
}
