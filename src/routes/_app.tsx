import { createFileRoute } from "@tanstack/react-router";
import { RootLayout } from "@/layouts";

export const Route = createFileRoute("/_app")({
  component: RootLayout,
});
