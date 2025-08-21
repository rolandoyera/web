import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // Add this line to include src directory
  ],
  // Remove the important: "#__next" line - this was causing the issue
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
