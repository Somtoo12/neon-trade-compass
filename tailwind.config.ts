
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
				},
				tactical: {
					background: '#0A0E17', // Deep void background
					profit: '#00FF88',     // Neon mint for profit zones
					risk: '#FF0055',       // Laser red for risk alerts
					neutral: '#1E90FF',    // Bright blue for neutral data
				},
				// Colors with opacity
				'tactical-background': {
					DEFAULT: '#0A0E17',
					80: 'rgba(10, 14, 23, 0.8)',
				},
			},
			fontFamily: {
				rajdhani: ['Rajdhani', 'sans-serif'],
				'share-tech': ['"Share Tech Mono"', 'monospace'],
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
				'tactical-pulse': {
					'0%, 100%': { opacity: '1', boxShadow: '0 0 5px var(--pulse-color)' },
					'50%': { opacity: '0.8', boxShadow: '0 0 15px var(--pulse-color)' },
				},
				'data-scan': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'text-glitch': {
					'0%, 100%': { textShadow: '0 0 5px #00FF88' },
					'25%': { textShadow: '2px 0 5px #00C2FF, -2px 0 5px #FF0055' },
					'50%': { textShadow: '0 0 10px #00FF88' },
					'75%': { textShadow: '-2px 0 5px #00C2FF, 2px 0 5px #FF0055' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'tactical-pulse': 'tactical-pulse 2s infinite',
				'data-scan': 'data-scan 5s ease infinite',
				'text-glitch': 'text-glitch 3s infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'cyber-grid': 'linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)',
			},
			boxShadow: {
				'glow': '0 0 10px rgba(var(--primary), 0.3)',
				'tactical-glow': '0 0 15px rgba(0, 255, 136, 0.5)',
				'risk-glow': '0 0 15px rgba(255, 0, 85, 0.5)',
			},
			backgroundSize: {
				'cyber-grid': '20px 20px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
