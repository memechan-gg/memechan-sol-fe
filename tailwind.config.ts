import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "link-quote-hover": "#FF0000",
        title: "#CF1105",
        regular: "#800000",
        link: "#0D00EE",
        pink: "#FF28FB",
        green: "#789922",
        line: "#5A5A5A",
        quote: "#030080",
        blue: "#0047FF",
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
      },
    },
  },
  plugins: [],
};
export default config;
