// src/routes/_layout/index.tsx
import { createLazyFileRoute } from "@tanstack/react-router";

function DashBoard() {
  return <div>Dashboard</div>;
}
export const Route = createLazyFileRoute("/_layout/")({
  component: DashBoard,
});
