import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const isProduction = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isProduction ? "/INT4/" : "/",
  
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});