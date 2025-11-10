import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signOut } = useAuthActions();

  return (
    <>
      <button
        className="cursor-pointer bg-red-300 p-2"
        onClick={() => signOut()}
        type="button"
      >
        Sign out
      </button>
      <div>Hello "/sign-out"!</div>
    </>
  );
}
