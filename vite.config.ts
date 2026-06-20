import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const isProduction = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isProduction ? "/INT4/" : "/",

  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },

  server: {
    headers: {
      // These two headers enable "cross-origin isolation" in the browser.
      // The background removal library (@imgly/background-removal) runs a
      // machine-learning model inside a WebAssembly worker. To share memory
      // between the main thread and that worker (SharedArrayBuffer), the
      // browser requires both headers to be present — otherwise it blocks
      // multi-threading and the model may silently fail, especially on mobile.
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});