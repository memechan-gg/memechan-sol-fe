import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "link-quote-hover": "#FF0000",
        title: "#CF1105",
        regular: "var(--color-text-regular)",
        link: "#0D00EE",
        pink: "#FF28FB",
        green: "#789922",
        line: "#5A5A5A",
        quote: "#030080",
        blue: "#0047FF",
        deepGreen: "#117743",
        lightRose: "#E0BFB7",
        lightGray: "#D1D5DB",
        primaryPink: "#f95292",
      },
      backgroundColor: {
        "link-quote-hover": "#FF0000",
        title: "#CF1105",
        regular: "#800000",
        link: "#0D00EE",
        pink: "#FF28FB",
        green: "#789922",
        line: "#5A5A5A",
        quote: "#030080",
        blue: "#0047FF",
        board: "#fca",
        lightPink: "#F0E0D6",
        dark: "#222222",
      },
      borderColor: {
        "link-quote-hover": "#FF0000",
        title: "#CF1105",
        regular: "#800000",
        link: "#0D00EE",
        pink: "#FF28FB",
        green: "#789922",
        line: "#5A5A5A",
        quote: "#030080",
        blue: "#0047FF",
        dustyPink: "#D9BFB7",
      },
    },
    screens: {
      xxs: "350px",
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
export default config;
