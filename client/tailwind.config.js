/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pacific-cyan": "#33A9D4",
        "crayola-red": "#f50057",
      },
    },
  },
  plugins: [],
  prefix: "tw-",
};
