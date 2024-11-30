/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,

  theme: {
    extend: {},
    colors: {
      primary: "#4c5760",
      secondary: "#D7CEB2",
      tertiory: "#93A8AC",
      khaki: "#A59E8C",
      dimgrey: "#66635B"
    }
  },
  plugins: [],
}

