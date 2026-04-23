import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/super/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/super/dashboard"!</div>
}
