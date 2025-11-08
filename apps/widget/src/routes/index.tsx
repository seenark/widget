import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const suspendUsers = convexQuery(api.users.getMany, {});
  const { data: users } = useSuspenseQuery(suspendUsers);

  const createUser = useConvexMutation(api.users.add);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/widget</p>
      <div>
        <button
          className="rounded-full bg-red-200 p-2"
          onClick={() => createUser()}
          type="button"
        >
          Add User
        </button>
      </div>
      <p> {JSON.stringify(users)}</p>
    </div>
  );
}
