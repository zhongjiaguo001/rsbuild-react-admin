import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { initializeRouter } from "@/routes";
import { queryClient } from "@/utils/query/queryClient";
import ErrorPage from "@/pages/system/error/ErrorPage";
import { ErrorBoundary } from "@/components";
import "@/styles/global.css";

// 创建路由实例
const router = initializeRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<ErrorPage />}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);
