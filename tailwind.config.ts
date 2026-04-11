import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        "ink-soft": "#121212",
        bone: "#ebe6dc",
        gold: "#c4a052",
        muted: "#7a7670",
      },
      fontFamily: {
        display: ["var(--font-bebas)"],
        serif: ["var(--font-playfair)"],
        sans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
