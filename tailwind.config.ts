import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors - Terrace-inspired dark theme
        background: "#0a0a0a",
        surface: "#141414",
        "surface-hover": "#1a1a1a",
        border: "#262626",
        header: "#1a1a1a",
        
        // Text colors
        "text-primary": "#ffffff",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
        
        // Brand colors
        brand: "#8fe848",  // Orderbook brand green
        
        // Primary green (Terrace-style)
        primary: {
          DEFAULT: "#00ff88",
          hover: "#00e67a",
          active: "#00cc6b",
          muted: "rgba(0, 255, 136, 0.1)",
        },
        
        // Trading colors
        bid: "#00ff88",
        "bid-bg": "rgba(0, 255, 136, 0.1)",
        ask: "#ff0055",
        "ask-bg": "rgba(255, 0, 85, 0.1)",
      },
      fontFamily: {
        sans: ["var(--font-terrace)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.3)",
        "glow-green-sm": "0 0 10px rgba(0, 255, 136, 0.2)",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
