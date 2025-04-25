// src/utils/routeGenerator.js
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { layoutRoute } from "@/routes";

// 默认布局组件
const DefaultLayout = ({ children }) => <>{children}</>;

// 映射若依路由格式到React组件路径
const componentMap = {
  // 示例：若依中的组件路径映射到实际的React组件
  "system/user/index": () => import("@/pages/system/user"),
  "system/role/index": () => import("@/pages/system/role"),
  // ...其他组件映射
};

// 处理组件导入
const loadComponent = (component) => {
  if (!component) return DefaultLayout;

  // 尝试从组件映射中获取
  const importFunc = componentMap[component];
  if (importFunc) {
    return lazyRouteComponent(importFunc);
  }

  // 如果找不到映射，尝试动态导入
  try {
    return lazyRouteComponent(() => import(`@/pages/${component}`));
  } catch (error) {
    console.error(`无法加载组件: ${component}`, error);
    return DefaultLayout;
  }
};

// 递归处理路由
export const generateRoutes = (routes = [], parentPath = "") => {
  return routes.map((route) => {
    // 计算完整路径
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;

    // 创建当前路由
    const currentRoute = createRoute({
      getParentRoute: () => layoutRoute,
      path: fullPath,
      component: loadComponent(route.component),
      // 添加meta信息到路由
      meta: {
        ...route.meta,
        title: route.meta?.title || route.name,
        icon: route.meta?.icon,
        hidden: route.hidden,
      },
    });

    // 如果有子路由，递归处理
    if (route.children && route.children.length > 0) {
      currentRoute.addChildren(generateRoutes(route.children, fullPath));
    }

    return currentRoute;
  });
};
