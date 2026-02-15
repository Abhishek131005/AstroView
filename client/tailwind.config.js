/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    fontSize: {
      'xs': '0.7rem',
      'sm': '0.8125rem',
      'base': '0.875rem',
      'lg': '0.9375rem',
      'xl': '1.0625rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
    },
    extend: {
      colors: {
        'bg-primary': '#0B0D17',
        'bg-secondary': '#1B1D2A',
        'bg-tertiary': '#252840',
        'electric-blue': '#4F9CF7',
        'cosmic-purple': '#7C5CFC',
        'solar-amber': '#FFB800',
        'aurora-green': '#00E676',
        'star-white': '#E8EAED',
        'muted-gray': '#9AA0A6',
        'faint-gray': '#5F6368',
        'danger-red': '#FF5252',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
