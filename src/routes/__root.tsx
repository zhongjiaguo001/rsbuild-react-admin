// src/routes/__root.tsx
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store";
import { queryClient } from "@/utils/query/queryClient";
import { authApi } from "@/api/auth";

// 白名单路径
export const whiteList = ["/login", "/register"];

// 检查路径是否在白名单中
export const isWhiteList = (path: string) => {
  return whiteList.some((pattern) => path.startsWith(pattern));
};

export const Route = createRootRoute({
  component: Outlet,
  beforeLoad: async ({ location }) => {
    // 如果是白名单路径，直接通过
    if (isWhiteList(location.pathname)) {
      return;
    }

    // 检查用户是否已登录
    if (useAuthStore.getState().token) {
      if (location.pathname === "/login") {
        throw redirect({ to: "/" });
      }

      // 如果用户信息不存在，获取用户信息
      if (!useAuthStore.getState().userInfo) {
        // 使用 React Query 预取用户信息
        await queryClient.prefetchQuery({
          queryKey: ["userInfo"],
          queryFn: async () => {
            const { data } = await authApi.getUserInfo();
            if (data) {
              useAuthStore.getState().setUserInfo(data);
            }
            return data;
          },
        });

        // 预取用户菜单
        await queryClient.prefetchQuery({
          queryKey: ["userMenus"],
          queryFn: async () => {
            const { data } = await authApi.getUserMenus();

            if (data) {
              useAuthStore.getState().setMenus(data);
            }
            return data;
          },
        });
      }
    } else {
      // 未登录且不在白名单，重定向到登录页
      if (!isWhiteList(location.pathname)) {
        throw redirect({
          to: `/login`,
          search: {
            redirect: location.pathname,
          },
        });
      }
    }
  },
});
