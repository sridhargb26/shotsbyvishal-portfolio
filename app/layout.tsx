import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ShotsByVishal — Photography",
  description:
    "Vishal Dey — Editorial, Portrait & Street Photographer. Published in Elléments Magazine, 7HuesMag and more.",
  openGraph: {
    title: "ShotsByVishal",
    description: "Editorial, Portrait & Street Photography by Vishal Dey",
    url: "https://shotsbyvishal.com",
    siteName: "ShotsByVishal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebas.variable} ${playfair.variable} ${dmSans.variable}`}>
      <body>
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
