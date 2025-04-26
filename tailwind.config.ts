import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        neon: {
          green: '#00ffb3',
          purple: '#7b61ff',
          blue: '#00c2ff',
          cyan: '#00FEFC',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px var(--glow-color))' },
          '50%': { filter: 'drop-shadow(0 0 10px var(--glow-color))' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(0, 254, 252, 0.3)' },
          '50%': { borderColor: 'rgba(0, 254, 252, 0.8)' }
        },
        'pulse-text': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-border': 'pulse-border 2s infinite',
        'pulse-text': 'pulse-text 1.5s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 254, 252, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 254, 252, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(var(--primary), 0.3)',
        'neon-cyan': '0 0 10px rgba(0, 254, 252, 0.5)',
        'neon-blue': '0 0 10px rgba(0, 194, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(123, 97, 255, 0.5)',
        'neon-green': '0 0 10px rgba(0, 255, 179, 0.5)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
