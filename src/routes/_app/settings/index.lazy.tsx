import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/"!</div>;
}
