/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            "corporate-blue": "#2563EB",
            "main-dark": "#111827",
            "secondary-gray": "#6B7280",
            "bg-page": "#F2F4F7",
        },
        borderRadius: {
            "card": "10px",
        },
        fontFamily: {
            sans: ['"Open Sans"', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }
  
