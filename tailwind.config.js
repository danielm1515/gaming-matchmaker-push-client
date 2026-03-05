/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0D0F14",
          secondary: "#141720",
          elevated: "#1C2030",
          border: "#252A3A",
        },
        accent: {
          primary: "#6C63FF",
          secondary: "#00D4FF",
          success: "#00FF88",
          warning: "#FFB800",
          danger: "#FF4757",
        },
        text: {
          primary: "#F0F2FF",
          secondary: "#8B91A8",
          muted: "#4A5168",
        },
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(108, 99, 255, 0.3)",
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(108, 99, 255, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(108, 99, 255, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
