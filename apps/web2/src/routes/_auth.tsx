import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthLayout } from "@/modules/auth/layouts/auth-layout";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
