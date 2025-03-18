import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
// import { SemiRspackPlugin } from "@douyinfe/semi-rspack-plugin";

// 使用 ES 模块写法配置 Semi 插件
// const semiRspackPlugin = new SemiRspackPlugin({
//   cssLayer: true,
// });

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx",
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
        // semiRspackPlugin,
        TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
      ],
    },
  },
});
