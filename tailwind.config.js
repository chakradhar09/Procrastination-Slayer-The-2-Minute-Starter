/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        body: ['"Manrope"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Semantic colors mapped to CSS variables
        bg: "var(--bg-color)",
        surface: "var(--surface-color)",
        "surface-highlight": "var(--surface-highlight)",
        border: "var(--border-color)",
        text: "var(--text-color)",
        "text-muted": "var(--text-muted)",

        // Brand/Accent colors
        "space-black": "#050816", // Keep for references, but prefer semantic 'bg'
        "neon-teal": "#64d8c1",
        "neon-purple": "#7a7cff",
        "brand-primary": "var(--brand-primary)",
        "brand-secondary": "var(--brand-secondary)",
      },
      boxShadow: {
        glow: "var(--glow-shadow)",
        "glow-purple": "0 0 20px rgba(122, 124, 255, 0.5)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
