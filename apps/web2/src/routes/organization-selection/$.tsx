import { createFileRoute } from "@tanstack/react-router";
import { Schema as S } from "effect";
import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { OrganizationSelectView } from "@/modules/auth/views/organization-select-view";

const searchParams = S.Struct({
  redirect: S.String.pipe(S.optional),
});

export const Route = createFileRoute("/organization-selection/$")({
  component: Page,
  validateSearch: S.standardSchemaV1(searchParams),
});

function Page() {
  const queryParams = Route.useSearch();
  return (
    <AuthGuard>
      <OrganizationSelectView redirect={queryParams.redirect} />
    </AuthGuard>
  );
}
