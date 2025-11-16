import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <button className="cursor-pointer bg-red-300 p-2" type="button">
        Sign out
      </button>
      <div>Hello "/sign-out"!</div>
    </>
  );
}
