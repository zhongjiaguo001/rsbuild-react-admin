// src/routes/_layout.tsx
import { createFileRoute } from "@tanstack/react-router";
import { RootLayout } from "@/layouts";

// 布局路由 - 使用下划线前缀表示这是一个布局路由
export const Route = createFileRoute("/_layout")({
  component: RootLayout,
});
