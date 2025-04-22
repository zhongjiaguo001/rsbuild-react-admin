import { RootLayout } from "@/layouts";
import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import Login from "@/pages/login";
import User from "@/pages/system/user";
import Role from "@/pages/system/role";
import Menu from "@/pages/system/menu";

const AuthRole = lazy(() => import("@/pages/system/user/AuthRole"));
const Chat = lazy(() => import("@/pages/chat"));
export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/chat/:sessionId",
        element: <Chat />,
      },
      {
        path: "/system",
        children: [
          {
            path: "/system/user",
            element: <User />,
          },
          {
            path: "/system/role",
            element: <Role />,
          },
          {
            path: "/system/menu",
            element: <Menu />,
          },
        ],
      },
    ],
  },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: "/system/user-auth",
    element: <RootLayout />,
    children: [
      {
        path: "role/:userId",
        element: <AuthRole />,
      },
    ],
  },
];

export function Router() {
  const router = useRoutes([...routes, ...dynamicRoutes]);

  return router;
}
