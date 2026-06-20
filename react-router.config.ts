import type { Config } from "@react-router/dev/config";

// GitHub Actions automatically sets GITHUB_ACTIONS to 'true' during deployment builds
const isProduction = process.env.GITHUB_ACTIONS === "true";

export default {
  // Use the repo subfolder in production, use root "/" for local development
  basename: isProduction ? "/INT4/" : "/",

  ssr: false,

  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
