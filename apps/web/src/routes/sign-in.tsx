import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e2e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-[#cdd6f4]">
            {step === "signIn"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            signIn("password", formData);
          }}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                autoComplete="email"
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-[#313244] bg-[#313244] px-3 py-2 text-[#cdd6f4] placeholder-[#45475a] focus:z-10 focus:border-[#89b4fa] focus:outline-none focus:ring-[#89b4fa] sm:text-sm"
                id="email"
                name="email"
                placeholder="Email address"
                required
                type="email"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-[#313244] bg-[#313244] px-3 py-2 text-[#cdd6f4] placeholder-[#45475a] focus:z-10 focus:border-[#89b4fa] focus:outline-none focus:ring-[#89b4fa] sm:text-sm"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </div>
          </div>
          <input name="flow" type="hidden" value={step} />
          <div>
            <button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#89b4fa] px-4 py-2 font-medium text-[#1e1e2e] text-base text-sm hover:bg-[#74c7ec] focus:outline-none focus:ring-2 focus:ring-[#89b4fa] focus:ring-offset-2"
              type="submit"
            >
              {step === "signIn" ? "Sign in" : "Sign up"}
            </button>
          </div>
          <div className="text-center">
            <button
              className="font-medium text-[#89b4fa] hover:text-[#74c7ec]"
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
              }}
              type="button"
            >
              {step === "signIn"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
