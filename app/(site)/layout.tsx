import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SiteShell from "@/components/SiteShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
