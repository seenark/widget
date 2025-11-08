import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const suspendUsers = convexQuery(api.users.getMany, {});
  const { data: users } = useSuspenseQuery(suspendUsers);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p>apps/web</p>
      <p> {JSON.stringify(users)}</p>
    </div>
  );
}
