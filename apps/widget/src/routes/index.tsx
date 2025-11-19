import { createFileRoute } from "@tanstack/react-router";
import { useVapi } from "@/modules/widget/hooks/use-vapi";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/widget</p>
      <button
        className="cursor-pointer rounded-2xl bg-green-300 p-2"
        onClick={() => startCall()}
        type="button"
      >
        Start call
      </button>
      <button
        className="cursor-pointer rounded-2xl bg-red-300 p-2"
        onClick={() => endCall()}
        type="button"
      >
        End Call
      </button>

      <p>is connected: {`${isConnected}`}</p>
      <p>is connecting: {`${isConnecting}`}</p>
      <p>is speaking: {`${isSpeaking}`}</p>
      <p>{JSON.stringify(transcript, null, 2)}</p>
    </div>
  );
}
