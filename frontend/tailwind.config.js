/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#EDF0E6",      // pale sage-stone background
        surface: "#F7F8F3",     // slightly lighter panel surface
        ink: "#22281F",         // near-black warm text
        muted: "#6B7563",       // secondary text
        forest: {
          DEFAULT: "#1F3324",   // structural dark (sidebar)
          light: "#2C4530",
        },
        gold: {
          DEFAULT: "#B9832F",   // primary action
          dark: "#96692375",
          light: "#D9A94F",
        },
        soil: "#6B4226",        // secondary accent
        leaf: "#4C7A3F",        // success
        rust: "#A6432E",        // alert / destructive
        line: "#DBDFD2",        // hairline dividers
      },
      fontFamily: {
        display: ["Zilla Slab", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
