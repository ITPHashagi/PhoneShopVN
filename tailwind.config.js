/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      width: {
        1280: "1280px",
      },
      maxWidth: {
        "1/2": "50%", // Thêm max-width 50%
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
