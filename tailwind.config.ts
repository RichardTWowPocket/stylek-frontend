import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6c74ab", // Primary color
          foreground: "#ffffff",
        },
        purple: {
          DEFAULT: "#B8A9D9", // Soft lavender
          foreground: "#ffffff",
        },
        pink: {
          DEFAULT: "#F5C2D1", // Soft rose pink
        },
        peach: {
          DEFAULT: "#F5E6D3", // Warm peach beige
          darker: "#E8D4C1", // Richer peach
        },
        success: "#A8D5BA", // Soft mint green
        warning: "#F5D5A3", // Soft amber
        destructive: "#F5A3A3", // Soft coral red
        muted: {
          DEFAULT: "#F5F0EB", // Warm light beige
          foreground: "#8B8B8B", // Soft gray
        },
        border: "#E8E0D8", // Warm light beige border
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
