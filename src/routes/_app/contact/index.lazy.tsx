import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/contact/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/contact/"!</div>;
}
