import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexProvider } from "convex/react";
import { ConvexAuthClientProvider } from "./lib/ConvexAuthClientProvider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    console.error("missing env VITE_CONVEX_URL");
  }

  const convexQueryClient = new ConvexQueryClient(convexUrl);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          <ConvexAuthClientProvider>{children}</ConvexAuthClientProvider>
        </ConvexProvider>
      ),
    }),
    queryClient
  );

  return router;
};
