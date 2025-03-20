import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Loading } from "@/components/Loading";

export const Route = createRootRoute({
  component: Outlet,
  pendingComponent: () => Loading,
});
