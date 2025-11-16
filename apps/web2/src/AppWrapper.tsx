import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import type { FC, PropsWithChildren } from "react";

const convexReactClient = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || ""
);

const convexQueryClient = new ConvexQueryClient(convexReactClient);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

const AppWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ConvexAuthProvider client={convexReactClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ConvexAuthProvider>
);

export default AppWrapper;
