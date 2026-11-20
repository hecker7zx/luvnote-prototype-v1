/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "luv-black": "#0D0D0D",
        "luv-cream": "#F5F0E8",
        "luv-blush": "#F2E4DE",
        "luv-lavender": "#C8B4CD",
        "luv-pink": "#D8BBC6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"], // For the heavy editorial text
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
    },
  },
  plugins: [],
};
