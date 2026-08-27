/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7f2',
          100: '#ffeedebd',
          200: '#ffd7b5',
          300: '#ffb982',
          400: '#f9904d',
          500: '#c25e2e', // Terracotta warm accent
          600: '#b44e23',
          700: '#963c1c',
          800: '#79331d',
          900: '#632c1b',
        },
        neutral: {
          sand: '#f5f2eb',
          concrete: '#e2dec',
          charcoal: '#1c1b18',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 10px 30px -10px rgba(194, 94, 46, 0.15)',
        'warm-lg': '0 20px 40px -15px rgba(194, 94, 46, 0.25)',
      },
      borderRadius: {
        architectural: '0.75rem',
      },
    },
  },
  plugins: [],
};
