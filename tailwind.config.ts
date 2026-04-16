import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base:    '#0A0A0F',
        surface: '#111118',
        elevated:'#1A1A24',
        border:  '#252533',
        accent:  '#2DD4BF',
        'accent-dim': '#1BA89A',
        'accent-glow': 'rgba(45,212,191,0.15)',
        muted:   '#6B7280',
        subtle:  '#9CA3AF',
        text:    '#F1F5F9',
        'text-dim': '#94A3B8',
        error:   '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        DEFAULT: '8px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(45,212,191,0.15)',
        'glow':    '0 0 24px rgba(45,212,191,0.2)',
        'glow-lg': '0 0 48px rgba(45,212,191,0.25)',
        'card':    '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
