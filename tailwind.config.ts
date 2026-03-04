import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255,255,255,0.07)",
        input: "rgba(255,255,255,0.1)",
        ring: "hsl(var(--ring))",
        background: "var(--bg-app)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#ECF0F1",
        },
        secondary: {
          DEFAULT: "var(--bg-card)",
          foreground: "var(--text)",
        },
        destructive: {
          DEFAULT: "var(--red)",
          foreground: "#fff",
        },
        muted: {
          DEFAULT: "var(--bg-elevated)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "#fff",
        },
        popover: {
          DEFAULT: "var(--bg-card)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--bg-card)",
          foreground: "var(--text)",
        },
        green: "#27AE60",
        yellow: "#F39C12",
        red: "#E74C3C",
        "accent-light": "#2196B3",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "monospace"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
