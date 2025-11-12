import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@workspace/backend/api";
import type { FC, PropsWithChildren } from "react";
import { AuthLayout } from "../layouts/auth-layout";
import { OrganizationSelectView } from "../views/organization-select-view";

export const OrganizationGuard: FC<PropsWithChildren> = ({ children }) => {
  const organizationSuspend = convexQuery(api.organization.getOrganization, {});
  const { data: organization } = useSuspenseQuery(organizationSuspend);

  if (!organization) {
    return (
      <AuthLayout>
        <OrganizationSelectView />
      </AuthLayout>
    );
  }

  return <div>{children}</div>;
};
