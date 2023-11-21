import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#21823C",
        "primary-transparent": {
          10: "rgba(33, 130, 60, 0.1)",
          20: "rgba(33, 130, 60, 0.2)",
          30: "rgba(33, 130, 60, 0.3)",
          40: "rgba(33, 130, 60, 0.4)",
          50: "rgba(33, 130, 60, 0.5)",
          60: "rgba(33, 130, 60, 0.6)",
          70: "rgba(33, 130, 60, 0.7)",
          80: "rgba(33, 130, 60, 0.8)",
          90: "rgba(33, 130, 60, 0.9)",
        },
        secondary: "#9DC8A8",
        "secondary-transparent": {
          10: "rgba(157, 200, 168, 0.1)",
          20: "rgba(157, 200, 168, 0.2)",
          30: "rgba(157, 200, 168, 0.3)",
          40: "rgba(157, 200, 168, 0.4)",
          50: "rgba(157, 200, 168, 0.5)",
          60: "rgba(157, 200, 168, 0.6)",
          70: "rgba(157, 200, 168, 0.7)",
          80: "rgba(157, 200, 168, 0.8)",
          90: "rgba(157, 200, 168, 0.9)",
        },
      },
      boxShadow: {
        light: "0px 4px 16px 0px rgba(33,130,60,0.1)",
        dark: "0px 2px 8px 0px rgba(33,130,60,0.25)",
        red: "0px 2px 8px 0px rgba(220,38,38,0.25)",
      },
      // fontSize: {
      //   header1: ["34px", { fontWeight: "700" }],
      //   header2: ["20px", { fontWeight: "700" }],
      //   body: ["16px", { fontWeight: "400" }],
      //   small: ["10px", { fontWeight: "400" }],
      // },
      screens: {
        standalone: { raw: "(display-mode: standalone)" },
      },
    },
  },
  plugins: [],
} satisfies Config;
