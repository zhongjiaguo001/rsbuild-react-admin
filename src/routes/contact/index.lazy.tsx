import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/contact/")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="h-full bg-gray-50">
      <div className="text-gray-400">21212212121211212122121</div>
    </div>
  );
}
