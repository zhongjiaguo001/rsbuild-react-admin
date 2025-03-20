import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login/__layout")({
  component: Outlet,
});
