import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "../modules/auth/components/auth-guard";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}
