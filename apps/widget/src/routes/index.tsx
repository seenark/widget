import { createFileRoute } from "@tanstack/react-router";
import { useVapi } from "@/modules/widget/hooks/use-vapi";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {} = useVapi();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/widget</p>
      <button type="button">Call</button>
    </div>
  );
}
