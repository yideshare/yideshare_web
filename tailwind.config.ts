import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ----------  COLOURS (use CSS vars)  ---------- */
      colors: {
        background: "hsl(var(--background))",           // #e9f4f5
        foreground: "hsl(var(--foreground))",           // #555761

        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },

        primary: {                                      // dark‑green
          DEFAULT: "hsl(var(--primary))",               // #38705f
          foreground: "hsl(var(--primary-foreground))", // #ffffff
        },
        secondary: {                                    // light‑green
          DEFAULT: "hsl(var(--secondary))",             // #cde3dd
          foreground: "hsl(var(--secondary-foreground))",
        },

        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* handy aliases */
        brand: {
          50: "hsl(var(--background))",   // light‑blue
          100: "hsl(var(--secondary))",   // light‑green
          500: "hsl(var(--primary))",     // dark‑green
          600: "hsl(162 33% 26%)",        // darker‑green hover
        },
      },

      /* ----------  TYPOGRAPHY & RADIUS  ---------- */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],      // headings / labels
        body: ["Nunito", "ui-rounded", "sans-serif"],    // body text
      },
      borderRadius: {
        lgx: "1.25rem",          // pill shape
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,.06)",
        cardHover: "0 2px 10px rgba(0,0,0,.08)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // require("@tailwindcss/forms")     // ← uncomment if you install it
  ],
};

export default config;
