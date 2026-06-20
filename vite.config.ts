import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const isProduction = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isProduction ? "/INT4/" : "/",
  
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },

  build: {
    assetsDir: "assets",
  },
  experimental: {
    renderBuiltUrl(filename, { type }) {
      if (isProduction && type === "asset") {
        return `/INT4/${filename}`;
      }
      return filename;
    }
  }
});