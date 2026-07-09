import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2f6fed",
          600: "#255fd0",
          700: "#1e4ba6",
        },
        ink: {
          900: "#0f172a",
          700: "#334155",
          500: "#64748b",
          400: "#94a3b8",
        },
        surface: {
          bg: "#f6f8fb",
          card: "#ffffff",
          line: "#e6eaf0",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
    },
  },
  plugins: [],
};

export default config;
