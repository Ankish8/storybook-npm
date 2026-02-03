/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ['Source Sans Pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        // Legacy shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Semantic colors - Primary UI
        "semantic-primary": "var(--semantic-primary)",
        "semantic-primary-hover": "var(--semantic-primary-hover)",
        "semantic-primary-selected": "var(--semantic-primary-selected)",
        "semantic-primary-selected-hover": "var(--semantic-primary-selected-hover)",
        "semantic-primary-highlighted": "var(--semantic-primary-highlighted)",
        "semantic-primary-surface": "var(--semantic-primary-surface)",
        // Semantic colors - Brand
        "semantic-brand": "var(--semantic-brand)",
        "semantic-brand-hover": "var(--semantic-brand-hover)",
        "semantic-brand-selected": "var(--semantic-brand-selected)",
        "semantic-brand-selected-hover": "var(--semantic-brand-selected-hover)",
        "semantic-brand-highlighted": "var(--semantic-brand-highlighted)",
        "semantic-brand-surface": "var(--semantic-brand-surface)",
        // Semantic colors - Background
        "semantic-bg-primary": "var(--semantic-bg-primary)",
        "semantic-bg-secondary": "var(--semantic-bg-secondary)",
        "semantic-bg-ui": "var(--semantic-bg-ui)",
        "semantic-bg-grey": "var(--semantic-bg-grey)",
        "semantic-bg-grey-hover": "var(--semantic-bg-grey-hover)",
        "semantic-bg-inverted": "var(--semantic-bg-inverted)",
        "semantic-bg-hover": "var(--semantic-bg-hover)",
        // Semantic colors - Text
        "semantic-text-primary": "var(--semantic-text-primary)",
        "semantic-text-secondary": "var(--semantic-text-secondary)",
        "semantic-text-placeholder": "var(--semantic-text-placeholder)",
        "semantic-text-link": "var(--semantic-text-link)",
        "semantic-text-inverted": "var(--semantic-text-inverted)",
        "semantic-text-muted": "var(--semantic-text-muted)",
        // Semantic colors - Border
        "semantic-border-primary": "var(--semantic-border-primary)",
        "semantic-border-secondary": "var(--semantic-border-secondary)",
        "semantic-border-accent": "var(--semantic-border-accent)",
        "semantic-border-layout": "var(--semantic-border-layout)",
        "semantic-border-input": "var(--semantic-border-input)",
        "semantic-border-input-focus": "var(--semantic-border-input-focus)",
        // Semantic colors - Disabled
        "semantic-disabled-primary": "var(--semantic-disabled-primary)",
        "semantic-disabled-secondary": "var(--semantic-disabled-secondary)",
        "semantic-disabled-text": "var(--semantic-disabled-text)",
        "semantic-disabled-border": "var(--semantic-disabled-border)",
        // Semantic colors - Error
        "semantic-error-primary": "var(--semantic-error-primary)",
        "semantic-error-surface": "var(--semantic-error-surface)",
        "semantic-error-text": "var(--semantic-error-text)",
        "semantic-error-border": "var(--semantic-error-border)",
        "semantic-error-hover": "var(--semantic-error-hover)",
        // Semantic colors - Warning
        "semantic-warning-primary": "var(--semantic-warning-primary)",
        "semantic-warning-surface": "var(--semantic-warning-surface)",
        "semantic-warning-text": "var(--semantic-warning-text)",
        "semantic-warning-border": "var(--semantic-warning-border)",
        "semantic-warning-hover": "var(--semantic-warning-hover)",
        // Semantic colors - Success
        "semantic-success-primary": "var(--semantic-success-primary)",
        "semantic-success-surface": "var(--semantic-success-surface)",
        "semantic-success-text": "var(--semantic-success-text)",
        "semantic-success-border": "var(--semantic-success-border)",
        "semantic-success-hover": "var(--semantic-success-hover)",
        // Semantic colors - Info
        "semantic-info-primary": "var(--semantic-info-primary)",
        "semantic-info-surface": "var(--semantic-info-surface)",
        "semantic-info-text": "var(--semantic-info-text)",
        "semantic-info-border": "var(--semantic-info-border)",
        "semantic-info-hover": "var(--semantic-info-hover)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
