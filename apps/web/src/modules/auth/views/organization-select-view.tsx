import { api } from "@workspace/backend/api";
import { useMutation } from "convex/react";
import { useState } from "react";

export const OrganizationSelectView = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createOrganization = useMutation(api.organization.createOrganization);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrganization({ name: name.trim() });
      setName("");
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center rounded-4xl bg-[#1e1e2e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-[#cdd6f4]">
            Create Organization
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="name">
                Organization Name
              </label>
              <input
                className="relative block w-full appearance-none rounded-md border border-[#313244] bg-[#313244] px-3 py-2 text-[#cdd6f4] placeholder-[#45475a] focus:z-10 focus:border-[#89b4fa] focus:outline-none focus:ring-[#89b4fa] sm:text-sm"
                disabled={isSubmitting}
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Organization name"
                required
                type="text"
                value={name}
              />
            </div>
          </div>
          <div>
            <button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#89b4fa] px-4 py-2 font-medium text-[#1e1e2e] text-sm hover:bg-[#74c7ec] focus:outline-none focus:ring-2 focus:ring-[#89b4fa] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting || !name.trim()}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
