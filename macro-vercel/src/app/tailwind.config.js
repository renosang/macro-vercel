/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",          // giữ thêm nếu bạn có file không trong src
    "./components/**/*.{js,ts,jsx,tsx}"    // giữ thêm nếu bạn có file không trong src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};