/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color, #3b82f6)',
          hover: 'var(--primary-hover, #2563eb)',
        },
        bg: {
          DEFAULT: 'var(--bg-color, #ffffff)',
          alt: 'var(--bg-alt-color, #f9fafb)',
        },
        text: {
          DEFAULT: 'var(--text-color, #111827)',
          muted: 'var(--text-muted-color, #6b7280)',
        }
      },
      borderRadius: {
        custom: 'var(--border-radius, 0.5rem)',
      },
      fontFamily: {
        custom: ['var(--font-family, sans-serif)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
