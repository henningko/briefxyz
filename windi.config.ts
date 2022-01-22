import { defineConfig } from "windicss/helpers";

export default defineConfig({
  preflight: true,
  darkMode: "media",
  plugins: [require("windicss/plugin/line-clamp")],
});
