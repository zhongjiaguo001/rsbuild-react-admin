import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
