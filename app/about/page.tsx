import { getSiteSettings } from "@/lib/content";
import AboutClient from "@/components/AboutClient";

export default async function AboutPage() {
  const settings = getSiteSettings();
  return <AboutClient settings={settings} />;
}
