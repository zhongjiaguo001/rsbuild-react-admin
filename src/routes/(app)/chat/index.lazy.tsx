import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/chat/"!</div>
}
