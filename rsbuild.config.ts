import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
import { pluginSass } from "@rsbuild/plugin-sass";
import { SemiRspackPlugin } from "@douyinfe/semi-rspack-plugin";
export default defineConfig({
  plugins: [pluginSass(), pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      "import.meta.env.RS_BASE_API_URL": JSON.stringify(
        process.env.RS_BASE_API_URL
      ),
    },
  },
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": "./src/*",
    },
  },
  tools: {
    rspack: {
      plugins: [
        new SemiRspackPlugin({
          theme: "@semi-bot/semi-theme-guoblog",
        }),
        TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
      ],
    },
  },
});
