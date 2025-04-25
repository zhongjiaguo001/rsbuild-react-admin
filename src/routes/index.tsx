// src/routes/index.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { LoadingSpinner } from "@/components";
import ErrorPage from "@/pages/system/error/ErrorPage";
import { RootLayout } from "@/layouts";
import { Empty } from "@douyinfe/semi-ui";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import { queryClient } from "@/utils/query/queryClient";
import { useAuthStore } from "@/store";

// 白名单路径
export const whiteList = ["/login", "/register"];

// 检查路径是否在白名单中
export const isWhiteList = (path: string) => {
  return whiteList.some((pattern) => path.startsWith(pattern));
};

const NotFound = () => (
  <Empty
    image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
    darkModeImage={
      <IllustrationNoResultDark style={{ width: 150, height: 150 }} />
    }
    description={"搜索无结果"}
    className="p-[30px]"
  />
);

// 创建根路由
export const rootRoute = createRootRoute({
  component: Outlet,
});

// 公共路由
export const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: Outlet,
});

export const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "login", // 移除前导斜杠，因为父路由已经有了
  component: lazyRouteComponent(() => import("@/pages/login")),
});

// 主布局路由
export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  beforeLoad: async ({ location }) => {
    if (useAuthStore.getState().token) {
      if (location.pathname === "/login") {
        throw redirect({ to: "/" });
      }

      if (isWhiteList(location.pathname)) {
        return;
      }

      // if (!useAuthStore.getState().userInfo) {
      //   console.log("获取数据");
      //   // await auth.getUserInfo();
      //   // await auth.getMenuList();
      // }
    } else {
      if (isWhiteList(location.pathname)) {
        return Outlet;
      } else {
        throw redirect({ to: `/login?redirect=${location.pathname}` });
      }
    }
  },
  component: RootLayout,
});

export const dashBoardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/", // 移除前导斜杠，因为父路由已经有了
  component: lazyRouteComponent(() => import("@/pages/dashboard")),
});

// 初始化路由器(只包含固定路由)
export function initializeRouter() {
  // 构建路由树
  const routeTree = rootRoute.addChildren([
    publicRoute.addChildren([loginRoute]),
    layoutRoute.addChildren([dashBoardRoute]),
  ]);

  // 创建路由器
  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
    // 可以添加其他配置...
    defaultErrorComponent: ErrorPage,
    defaultPendingComponent: LoadingSpinner,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
  });
}

// 更新路由器(添加动态路由)
export function updateRouterWithDynamicRoutes(router, dynamicRoutes) {
  if (!dynamicRoutes || dynamicRoutes.length === 0) {
    return router;
  }

  // 将动态路由添加到主布局路由
  layoutRoute.addChildren(dynamicRoutes);

  // 更新路由器
  router.update({
    routeTree: rootRoute,
  });

  return router;
}
