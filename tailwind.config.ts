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
        title: "#CF1105", // TODO REMOVE AFTER REFACTOR
        regular: "var(--color-text-regular)", // TODO REMOVE AFTER REFACTOR
        "mono-100": "#222222",
        "mono-200": "#242424",
        "mono-300": "#353535",
        "mono-400": "#3e3e3e",
        "mono-500": "#979797",
        "mono-600": "#ffffff",
        "primary-100": "#f95292",
        "primary-200": "#d74a80",
        "primary-300": "#b4446e",
        "primary-400": "#933b5c",
        "primary-500": "#6f344b",
        "primary-600": "#4c2d38",
        "yellow-100": "#d4cb19",
        "yellow-200": "#b7b019",
        "yellow-300": "#9a951a",
        "yellow-400": "#7e7a1c",
        "yellow-500": "#615f1e",
        "yellow-600": "#454420",
        "green-100": "#179a58",
        "green-200": "#1a8750",
        "green-300": "#1a7447",
        "green-400": "#1c603e",
        "green-500": "#1e4d36",
        "green-600": "#203a2d",
        "red-100": "#fb7070",
        "red-200": "#d96465",
        "red-300": "#b65757",
        "red-400": "#934b4b",
        "red-500": "#703e3e",
        "red-600": "#4d3232",
      },
      backgroundColor: {
        title: "#CF1105", // TODO REMOVE AFTER REFACTOR
        regular: "var(--color-text-regular)", // TODO REMOVE AFTER REFACTOR
        "mono-100": "#222222",
        "mono-200": "#242424",
        "mono-300": "#353535",
        "mono-400": "#3e3e3e",
        "mono-500": "#979797",
        "mono-600": "#ffffff",
        "primary-100": "#f95292",
        "primary-200": "#d74a80",
        "primary-300": "#b4446e",
        "primary-400": "#933b5c",
        "primary-500": "#6f344b",
        "primary-600": "#4c2d38",
        "yellow-100": "#d4cb19",
        "yellow-200": "#b7b019",
        "yellow-300": "#9a951a",
        "yellow-400": "#7e7a1c",
        "yellow-500": "#615f1e",
        "yellow-600": "#454420",
        "green-100": "#179a58",
        "green-200": "#1a8750",
        "green-300": "#1a7447",
        "green-400": "#1c603e",
        "green-500": "#1e4d36",
        "green-600": "#203a2d",
        "red-100": "#fb7070",
        "red-200": "#d96465",
        "red-300": "#b65757",
        "red-400": "#934b4b",
        "red-500": "#703e3e",
        "red-600": "#4d3232",
      },
      borderColor: {
        title: "#CF1105", // TODO REMOVE AFTER REFACTOR
        regular: "var(--color-text-regular)", // TODO REMOVE AFTER REFACTOR
        "mono-100": "#222222",
        "mono-200": "#242424",
        "mono-300": "#353535",
        "mono-400": "#3e3e3e",
        "mono-500": "#979797",
        "mono-600": "#ffffff",
        "primary-100": "#f95292",
        "primary-200": "#d74a80",
        "primary-300": "#b4446e",
        "primary-400": "#933b5c",
        "primary-500": "#6f344b",
        "primary-600": "#4c2d38",
        "yellow-100": "#d4cb19",
        "yellow-200": "#b7b019",
        "yellow-300": "#9a951a",
        "yellow-400": "#7e7a1c",
        "yellow-500": "#615f1e",
        "yellow-600": "#454420",
        "green-100": "#179a58",
        "green-200": "#1a8750",
        "green-300": "#1a7447",
        "green-400": "#1c603e",
        "green-500": "#1e4d36",
        "green-600": "#203a2d",
        "red-100": "#fb7070",
        "red-200": "#d96465",
        "red-300": "#b65757",
        "red-400": "#934b4b",
        "red-500": "#703e3e",
        "red-600": "#4d3232",
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
