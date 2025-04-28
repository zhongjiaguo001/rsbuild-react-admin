// src/main.tsx
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { queryClient } from "@/utils/query/queryClient";
import { routeTree } from "./routeTree.gen";
import { ErrorBoundary } from "@/components";
import { LoadingSpinner } from "@/components";
import ErrorPage from "@/pages/system/error/ErrorPage";
import NotFoundPage from "@/pages/system/error/NotFound";

import "@/styles/global.css";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultErrorComponent: ErrorPage,
  defaultPendingComponent: LoadingSpinner,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);
