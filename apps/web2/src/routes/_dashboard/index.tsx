import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { SignOutView } from "@/modules/auth/views/sign-out-view";

export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const usersSuspense = convexQuery(api.users.getMany, {});

  const { data: users } = useSuspenseQuery(usersSuspense);

  const addUser = useConvexMutation(api.users.add);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/web</p>
      <button
        className="cursor-pointer rounded-2xl bg-blue-300 p-2"
        onClick={() => {
          throw new Error("Test error");
          addUser();
        }}
        type="button"
      >
        Add User
      </button>
      <p> {JSON.stringify(users)}</p>
      <SignOutView />
    </div>
  );
}
