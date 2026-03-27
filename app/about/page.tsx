import { getSiteSettings, urlFor } from "@/sanity/lib/client";
import AboutClient from "@/components/AboutClient";

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutClient settings={settings} />;
}
