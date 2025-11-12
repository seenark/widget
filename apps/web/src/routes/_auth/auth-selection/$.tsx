import { createFileRoute } from "@tanstack/react-router";
import { OrganizationSelectView } from "../../../modules/auth/views/organization-select-view";

export const Route = createFileRoute("/_auth/auth-selection/$")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrganizationSelectView />;
}
