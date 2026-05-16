import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const herouiPlugin = heroui as unknown as (opts?: unknown) => any;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/**/dist/**/*.{js,mjs}",
    "./node_modules/@heroui/**/node_modules/@heroui/theme/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  safelist: [
    "bg-primary",
    "text-primary-foreground",
    "bg-success",
    "text-success-foreground",
    "bg-warning",
    "text-warning-foreground",
    "bg-danger",
    "text-danger-foreground",
    "bg-default",
    "text-default-foreground",
  ],
  darkMode: "class",
  plugins: [
    herouiPlugin({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#F5F0FF",
              100: "#EADDFF",
              200: "#D4BBFF",
              300: "#BE99FF",
              400: "#A878FF",
              500: "#9356FF",
              600: "#7C3AED",
              700: "#6D28D9",
              800: "#5B21B6",
              900: "#4C1D95",
              DEFAULT: "#7C3AED",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#A878FF",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};

export default config;
