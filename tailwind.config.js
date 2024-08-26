/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#2d2d2d',
        'light-gray': '#f0f0f0',
        'yellow-primary': '#f4b400',
        'yellow-secondary': '#fdd835',
        'white': '#ffffff',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [require("@tailwindcss/typography")]
};
