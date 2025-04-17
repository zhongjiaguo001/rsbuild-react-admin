import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 数据在1分钟内保持新鲜
      //   cacheTime: 1000 * 300, // 缓存保留5分钟
      refetchOnWindowFocus: true, // 窗口聚焦时自动重新获取数据
      retry: 1, // 请求失败时最多重试2次
    },
  },
});
