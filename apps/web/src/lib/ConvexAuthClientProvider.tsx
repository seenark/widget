import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexAuthClientProvider({ children }: PropsWithChildren) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
