/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          50: "#f4f8f8",
          100: "#dcebeb",
          200: "#bdd9d9",
          300: "#91bcbc",
          400: "#5e979c",
          500: "#417980",
          600: "#315f66",
          700: "#284d53",
          800: "#233f44",
          900: "#21353a"
        },
        sand: "#f4efe8",
        ember: "#cb6d51",
        pine: "#2d4c44"
      },
      fontFamily: {
        sans: ["Segoe UI", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "ui-serif", "serif"]
      },
      boxShadow: {
        panel: "0 18px 45px rgba(24, 39, 45, 0.08)",
        "panel-hover": "0 24px 60px rgba(24, 39, 45, 0.14)",
        "panel-soft": "0 12px 30px rgba(15, 23, 42, 0.06)",
        "button-focus": "0 10px 24px rgba(49, 95, 102, 0.18)"
      },
      backgroundImage: {
        "medical-grid":
          "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
