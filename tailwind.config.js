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
          DEFAULT: "#5eead4",
          dark: "#4dd4b8",
          foreground: "#000000",
          muted: "rgba(94, 234, 212, 0.10)",
          subtle: "rgba(94, 234, 212, 0.06)",
          border: "rgba(94, 234, 212, 0.25)",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          card: "#111111",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
  plugins: [],
};
