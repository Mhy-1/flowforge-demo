/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette for dark theme
        background: {
          DEFAULT: '#0a0a0f',
          secondary: '#111119',
          tertiary: '#1a1a24',
        },
        surface: {
          DEFAULT: '#16161f',
          hover: '#1e1e2a',
          active: '#252533',
        },
        border: {
          DEFAULT: '#2a2a3a',
          subtle: '#1f1f2d',
          accent: '#3a3a4f',
        },
        text: {
          DEFAULT: '#e5e5ef',
          muted: '#9999aa',
          subtle: '#666677',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#7c7ff7',
          active: '#4f46e5',
          muted: '#6366f120',
        },
        success: {
          DEFAULT: '#22c55e',
          muted: '#22c55e20',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted: '#f59e0b20',
        },
        error: {
          DEFAULT: '#ef4444',
          muted: '#ef444420',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
