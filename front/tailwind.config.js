/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors for OSCP mindmap
        'dark': {
          100: '#1e1e1e',
          200: '#2d2d2d',
          300: '#3c3c3c',
          400: '#4a4a4a',
        },
        'accent': {
          100: '#00ff41', // Matrix green
          200: '#0099cc', // Blue
          300: '#ff6b35', // Orange for warnings
        }
      }
    },
  },
  plugins: [],
}