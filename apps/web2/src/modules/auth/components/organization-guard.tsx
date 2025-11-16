import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLocation,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { type FC, type PropsWithChildren, useEffect, useRef } from "react";

export const OrganizationGuard: FC<PropsWithChildren> = ({ children }) => {
  const routeMatcher = useMatchRoute();
  const location = useLocation();
  const hasNavigated = useRef(false);

  const freePassRoutes = [
    "/sign-in",
    /*"/sign-out",*/ "/register",
    "/organization-selection/$",
  ];
  const shouldByPass = freePassRoutes.some((path) =>
    routeMatcher({ to: path, fuzzy: true })
  );
  const organizationSuspense = convexQuery(
    api.organization.getOwnerOfOrganization,
    {}
  );
  const { data: organization } = useSuspenseQuery(organizationSuspense);
  const nav = useNavigate();

  useEffect(() => {
    if (
      !organization &&
      shouldByPass === false &&
      hasNavigated.current === false
    ) {
      hasNavigated.current = true;
      const searchParams = new URLSearchParams({});
      console.log({ searchParams: searchParams.toString() });
      nav({
        to: "/organization-selection/$",
        search: {
          redirect: location.url,
        },
      });
    }
  }, [location.url, organization, shouldByPass, nav]);

  return <div>{children}</div>;
};
