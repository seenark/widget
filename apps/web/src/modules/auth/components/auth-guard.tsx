import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import type { FC, PropsWithChildren } from "react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => (
  <>
    <AuthLoading>
      <AuthLayout>
        <p>Loading...</p>
      </AuthLayout>
    </AuthLoading>
    <Authenticated>{children}</Authenticated>
    <Unauthenticated>
      <AuthLayout>
        <SignInView />
      </AuthLayout>
    </Unauthenticated>
  </>
);
