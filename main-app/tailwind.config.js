const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#0070f3",
      secondary: "#ff0080",
      success: "#00ff00",
      error: "#ff0000",
      warning: "#ff9900",
      dark: "#000000",
      light: "#ffffff",

      ore: {
        100: "#F8F2FF",
        200: "#D7BCFE",
        300: "#AE85FA",
        400: "#7C4CEF",
        500: "#4518D9",
        600: "#2508AC",
        700: "#100280",
        800: "#050053",
        900: "#000026",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
