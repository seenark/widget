import { useAuthActions } from "@convex-dev/auth/react";

export const SignOutView = () => {
  const { signOut } = useAuthActions();

  return (
    <button
      className="cursor-pointer rounded-2xl bg-red-300 p-2"
      onClick={signOut}
      type="button"
    >
      Sign out
    </button>
  );
};
