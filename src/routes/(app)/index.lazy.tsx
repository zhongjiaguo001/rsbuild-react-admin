import { createLazyFileRoute } from "@tanstack/react-router";
import { RootLayout } from "@/layouts";

export const Route = createLazyFileRoute("/(app)/")({
  component: RootLayout,
});
