import type { Config } from "@react-router/dev/config";

const isProduction = process.env.GITHUB_ACTIONS === "true";

export default {
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
