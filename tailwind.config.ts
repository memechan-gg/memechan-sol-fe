import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export const colors = {
  title: "var(--color-title)",
  regular: "var(--color-text-regular)",
  "mono-100": "var(--color-mono-100)",
  "mono-200": "var(--color-mono-200)",
  "mono-300": "var(--color-mono-300)",
  "mono-400": "var(--color-mono-400)",
  "mono-500": "var(--color-mono-500)",
  "mono-600": "var(--color-mono-600)",
  "primary-100": "var(--color-primary-100)",
  "primary-200": "var(--color-primary-200)",
  "primary-300": "var(--color-primary-300)",
  "primary-400": "var(--color-primary-400)",
  "primary-500": "var(--color-primary-500)",
  "primary-600": "var(--color-primary-600)",
  "yellow-100": "var(--color-yellow-100)",
  "yellow-200": "var(--color-yellow-200)",
  "yellow-300": "var(--color-yellow-300)",
  "yellow-400": "var(--color-yellow-400)",
  "yellow-500": "var(--color-yellow-500)",
  "yellow-600": "var(--color-yellow-600)",
  "green-100": "var(--color-green-100)",
  "green-200": "var(--color-green-200)",
  "green-300": "var(--color-green-300)",
  "green-400": "var(--color-green-400)",
  "green-500": "var(--color-green-500)",
  "green-600": "var(--color-green-600)",
  "red-100": "var(--color-red-100)",
  "red-200": "var(--color-red-200)",
  "red-300": "var(--color-red-300)",
  "red-400": "var(--color-red-400)",
  "red-500": "var(--color-red-500)",
  "red-600": "var(--color-red-600)",
} as const;

const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/memechan-ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: colors,
      backgroundColor: colors,
      borderColor: colors,
      boxShadow: {
        light: "4px 4px 0px 0px #00000040",
      },
      margin: {
        sideMargin: "calc(calc(100vw - 1240px) / 2)",
      },
      backdropOpacity: {
        lightOpacity: "20",
      },
      letterSpacing: {
        tightest: "-0.011em",
      },
    },
    screens: {
      xxs: "350px",
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
  safelist: [
    ...colorKeys.map((color) => `text-${color}`),
    ...colorKeys.map((color) => `bg-${color}`),
    ...colorKeys.map((color) => `border-${color}`),
    "text-left",
    "text-center",
    "text-right",
  ],
};
export default config;
