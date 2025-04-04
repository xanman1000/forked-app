/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#F9F8F6',
        primary: {
          DEFAULT: '#B7D6C2',
          dark: '#8BB8A2',
        },
        text: {
          DEFAULT: '#333333',
          soft: '#666666',
        }
      },
      fontFamily: {
        sans: ['Inter-Regular'],
        heading: ['Inter-Bold'],
      },
      borderRadius: {
        DEFAULT: '16px',
      },
      maxWidth: {
        content: '680px',
      },
      boxShadow: {
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        DEFAULT: '16px',
        section: '24px',
      }
    },
  },
  plugins: [],
}