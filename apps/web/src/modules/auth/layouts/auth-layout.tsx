import type { FC, PropsWithChildren } from "react";

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-full min-h-screen min-w-screen flex-col items-center justify-center">
    {children}
  </div>
);
