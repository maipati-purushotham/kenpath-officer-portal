import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#3B4FA8",
          600: "#2E3F8F",
          700: "#1E3A8A",
          800: "#182F70",
          900: "#0F1F4A",
        },
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          400: "#94A3B8",
          600: "#64748B",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Telugu", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 31, 74, 0.06), 0 1px 2px rgba(15, 31, 74, 0.04)",
        "card-hover":
          "0 4px 12px rgba(15, 31, 74, 0.08), 0 2px 4px rgba(15, 31, 74, 0.04)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
