import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userStore } from "@/store";
import { Toast } from "@douyinfe/semi-ui";

interface AuthGuardProps {
  children: ReactNode;
}

// 白名单路由，不需要登录也可以访问
const whiteList = ["/login", "/register", "/forgot-password"];

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const token = userStore((state) => state.token);

  // 检查当前路径是否在白名单中
  const isWhiteListPath = whiteList.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/")
  );

  useEffect(() => {
    // 如果没有token且不在白名单中，显示提示信息
    if (!token && !isWhiteListPath) {
      Toast.error("您还没有登录，请先登录！");
    }
  }, [token, isWhiteListPath]);

  // 如果用户未登录且当前路径不在白名单中，重定向到登录页面
  if (!token && !isWhiteListPath) {
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户已登录且访问登录页面，重定向到首页
  if (token && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  // 正常渲染子组件
  return <>{children}</>;
}
