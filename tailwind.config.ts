import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          500: "#06b6d4",
          700: "#0e7490"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
