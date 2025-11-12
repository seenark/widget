import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "../modules/auth/components/auth-guard";
import { OrganizationGuard } from "../modules/auth/components/organization-guard";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return (
    <AuthGuard>
      <OrganizationGuard>
        <Outlet />
      </OrganizationGuard>
    </AuthGuard>
  );
}
