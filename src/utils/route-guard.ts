// src/utils/route-guard.ts
import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store";
import { queryClient } from "@/utils/query/queryClient";
import { authApi } from "@/api/auth";
import { generateDynamicRoutes } from "@/utils/route-generator";

// // 配置进度条
// NProgress.configure({ showSpinner: false });

// 白名单路径
export const whiteList = ["/login", "/register"];

// 检查路径是否在白名单中
export const isWhiteList = (path: string) => {
  return whiteList.some((pattern) => path.startsWith(pattern));
};

// // 开始进度条
// export const startProgress = () => {
//   NProgress.start();
// };

// // 结束进度条
// export const endProgress = () => {
//   NProgress.done();
// };

// 验证用户认证状态
export const validateAuth = async (to: string) => {
  const auth = useAuthStore.getState();

  // 开始进度条
  //   startProgress();

  try {
    // 如果有token
    if (auth.token) {
      // 如果目标是登录页，重定向到首页
      if (to === "/login") {
        // endProgress();
        throw redirect({ to: "/" });
      }

      // 如果是白名单路径，直接通过
      if (isWhiteList(to)) {
        return;
      }

      // 如果没有用户信息，获取用户信息和菜单
      if (!auth.userInfo) {
        try {
          // 获取用户信息
          const userInfoResponse = await queryClient.fetchQuery({
            queryKey: ["userInfo"],
            queryFn: authApi.getUserInfo,
          });

          if (userInfoResponse.code !== 200) {
            throw new Error("获取用户信息失败");
          }

          // 更新用户信息到store
          useAuthStore.getState().setUserInfo(userInfoResponse.data);

          // 获取菜单
          const menusResponse = await queryClient.fetchQuery({
            queryKey: ["menus"],
            queryFn: authApi.getUserMenus,
          });

          if (menusResponse.code !== 200) {
            throw new Error("获取菜单失败");
          }

          // 更新菜单到store
          useAuthStore.getState().setMenus(menusResponse.data);

          // 生成动态路由
          const dynamicRoutes = generateDynamicRoutes(
            menusResponse.data,
            userInfoResponse.data?.permissions || []
          );

          return {
            menus: menusResponse.data,
            dynamicRoutes,
          };
        } catch (error) {
          // 获取用户信息失败，登出并重定向到登录页
          useAuthStore.getState().reset();
          //   endProgress();
          throw redirect({ to: "/login" });
        }
      }
    } else {
      // 没有token
      if (isWhiteList(to)) {
        // 在白名单中，直接通过
        return;
      } else {
        // 不在白名单中，重定向到登录页
        // endProgress();
        throw redirect({
          to: `/login?redirect=${encodeURIComponent(to)}`,
        });
      }
    }
  } catch (error) {
    // 确保进度条结束
    // endProgress();
    throw error;
  }
};
