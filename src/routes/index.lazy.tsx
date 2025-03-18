import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <h3>Welcome Home!</h3>

      <span className="border dark:bg-red-500">1212121121</span>
    </div>
  );
}
