/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rni: {
          green: "#0B3D2E",
          "green-light": "#12513D",
          gold: "#C79A2E",
          "gold-light": "#E0B84D",
          cream: "#F7F4EC",
        },
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
      },
    },
  },
  plugins: [],
};
