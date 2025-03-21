import { createRootRoute } from "@tanstack/react-router";
import { Loading } from "@/components/Loading";
import { Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Outlet,
  pendingComponent: Loading,
  beforeLoad: (ctx) => {
    console.log("beforeLoad", ctx);
  },
});
