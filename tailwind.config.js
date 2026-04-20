/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#8A1538",
          dark: "#6d112c",
          foreground: "#ffffff",
          muted: "#f5eaed",
          subtle: "rgba(138, 21, 56, 0.08)",
          border: "rgba(138, 21, 56, 0.22)",
        },
      },
    },
  },
  plugins: [],
};
