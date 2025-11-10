# Convex Authentication Tutorial

## Overview

This tutorial will guide you through implementing authentication in a modern web application using **Convex** as the backend and **TanStack Start** for the frontend. We'll build a complete authentication system with sign-in, sign-up, and protected routes.

### What We'll Build

- A full-stack authentication system with email/password
- User registration and login functionality
- Protected routes that require authentication
- User management with Convex database
- Modern UI with Tailwind CSS styling

### Why Convex?

Convex is a powerful backend-as-a-service that provides:
- **Real-time database** with automatic synchronization
- **Server functions** for secure backend logic
- **Built-in authentication** with multiple providers
- **Type safety** from database to frontend
- **Automatic API generation** - no REST API needed

## Prerequisites

Before starting, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **bun** (we'll use bun in this tutorial)
- **Git** for version control
- **VS Code** or your preferred code editor
- **Convex account** (free at [convex.dev](https://convex.dev))

## Project Setup

### 1. Clone and Setup the Project

```bash
# Clone the repository
git clone <your-repo-url>
cd saas-widget

# Switch to the convex-auth2 branch
git checkout convex-auth2

# Install dependencies
bun install
```

### 2. Environment Setup

Create environment variables for both the backend and frontend:

#### Backend Environment (.env.local)

Create `packages/backend/.env.local`:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=dev
CONVEX_SITE_URL=http://localhost:3000
```

**Why these variables?**
- `CONVEX_DEPLOYMENT=dev`: Tells Convex we're in development mode
- `CONVEX_SITE_URL`: The URL where your frontend will run (needed for OAuth redirects)

#### Frontend Environment (.env.local)

Create `apps/web/.env.local`:

```env
# Convex Connection
VITE_CONVEX_URL=http://localhost:3210
```

**Why this variable?**
- `VITE_CONVEX_URL`: Points to your local Convex backend server
- The `VITE_` prefix is required for Vite to expose the variable to the frontend

### 3. Start the Development Servers

```bash
# Terminal 1: Start Convex backend
cd packages/backend
bun run dev

# Terminal 2: Start the web frontend
cd apps/web
bun run dev
```

You should see:
- Convex backend running at `http://localhost:3210`
- Web frontend running at `http://localhost:3000`

## Understanding the Architecture

### Project Structure

```
saas-widget/
├── apps/
│   └── web/                 # TanStack Start frontend
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── lib/        # Utility functions
│       │   └── routes/     # File-based routing
│       └── .env.local      # Frontend environment variables
└── packages/
    └── backend/            # Convex backend
        ├── convex/
        │   ├── auth.ts     # Authentication configuration
        │   ├── schema.ts   # Database schema
        │   └── users.ts    # User-related functions
        └── .env.local      # Backend environment variables
```

### How Authentication Works

1. **Frontend**: User enters email/password in the sign-in form
2. **Convex Auth**: Validates credentials and creates a session
3. **Database**: Stores user information securely
4. **Frontend**: Receives authentication state and updates UI

## Step-by-Step Implementation

### Step 1: Backend Authentication Setup

#### Convex Schema (`packages/backend/convex/schema.ts`)

```typescript
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Include built-in auth tables (users, sessions, etc.)
  ...authTables,
  
  // Custom user data table
  my_users: defineTable({
    name: v.string(),
  }),
});
```

**Why this structure?**
- `authTables`: Provides pre-built tables for authentication (users, sessions, accounts)
- `my_users`: Custom table for additional user data beyond what auth provides
- Using `v.string()` ensures type safety for the name field

#### Authentication Configuration (`packages/backend/convex/auth.ts`)

```typescript
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements: () => {},
    }),
  ],
});
```

**Why this setup?**
- `Password provider`: Enables email/password authentication
- `validatePasswordRequirements`: Empty function means we accept any password (customize as needed)
- `convexAuth`: Creates all the authentication functions we'll use

#### Auth Provider Configuration (`packages/backend/convex/auth.config.ts`)

```typescript
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

**Why this configuration?**
- Tells Convex where our frontend is located
- `applicationID: "convex"` identifies this as a Convex auth application

### Step 2: User Management Functions

#### User Functions (`packages/backend/convex/users.ts`)

```typescript
import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all users (for demonstration)
export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Add a new user (protected)
export const add = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if user is authenticated
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ConvexError({
        data: {
          message: "Not Authenticated",
        },
      });
    }

    // Add user to our custom table
    const userId = await ctx.db.insert("users", { name: "HadesGod" });
    return userId;
  },
});
```

**Why this approach?**
- `getMany`: Public query to fetch users (for demo purposes)
- `add`: Protected mutation that requires authentication
- `ctx.auth.getUserIdentity()`: Convex's way to get the current user
- `ConvexError`: Provides structured error handling

### Step 3: Frontend Authentication Setup

#### Convex Provider (`apps/web/src/lib/ConvexAuthClientProvider.tsx`)

```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexAuthClientProvider({ children }: PropsWithChildren) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
```

**Why this provider?**
- Connects our frontend to the Convex backend
- Provides authentication context to the entire app
- Uses environment variable for the Convex URL

#### Root Layout Integration (`apps/web/src/routes/__root.tsx`)

The root route already includes the provider setup through the app structure. The `ConvexAuthClientProvider` wraps the entire application, making auth available everywhere.

### Step 4: Authentication UI

#### Sign-In Page (`apps/web/src/routes/sign-in/$.tsx`)

```typescript
import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/sign-in/$")({
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
              className="group base relative flex w-full justify-center rounded-md border border-transparent bg-[#89b4fa] px-4 py-2 font-medium text-[#1e1e2e] text-sm hover:bg-[#74c7ec] focus:outline-none focus:ring-2 focus:ring-[#89b4fa] focus:ring-offset-2"
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
```

**Why this implementation?**
- `useAuthActions()`: Hook to access authentication functions
- `FormData`: Native browser API for form handling
- `step` state: Toggles between sign-in and sign-up modes
- Hidden `flow` input: Tells Convex whether to sign in or sign up
- Dark theme styling: Uses Tailwind with custom colors

### Step 5: Protected Routes and User Data

#### Main Page (`apps/web/src/routes/index.tsx`)

```typescript
import {
  convexQuery,
  useConvexAuth,
  useConvexMutation,
} from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  // Fetch users from database
  const suspendUsers = convexQuery(api.users.getMany, {});
  const { data: users } = useSuspenseQuery(suspendUsers);

  // Check authentication status
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    console.log({ isAuthenticated });
  }, [isAuthenticated]);

  // Mutation to add user (protected)
  const addUser = useConvexMutation(api.users.add);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/web</p>
      <button
        className="cursor-pointer rounded-2xl bg-blue-300 p-2"
        onClick={() => {
          addUser();
        }}
        type="button"
      >
        Add User
      </button>
      <p> {JSON.stringify(users)}</p>
    </div>
  );
}
```

**Why this pattern?**
- `convexQuery`: Creates a query object for TanStack Query
- `useSuspenseQuery`: Fetches data with loading states
- `useConvexAuth`: Hook to check if user is authenticated
- `useConvexMutation`: Hook for mutations that require auth

## Testing the Authentication

### 1. Create an Account

1. Navigate to `http://localhost:3000/sign-in`
2. Click "Don't have an account? Sign up"
3. Enter your email and password
4. Click "Sign up"

### 2. Sign In

1. Enter your credentials
2. Click "Sign in"
3. You'll be redirected to the home page

### 3. Test Protected Actions

1. Try clicking "Add User" button
2. If authenticated, it will succeed
3. If not authenticated, you'll get an error

## Common Issues and Solutions

### Issue: "Not Authenticated" Error

**Problem**: The `addUser` function throws an authentication error.

**Solution**: Make sure you're signed in before trying to add users. The `useConvexAuth` hook should show `isAuthenticated: true`.

### Issue: Convex Connection Failed

**Problem**: Frontend can't connect to Convex backend.

**Solution**: 
1. Ensure `VITE_CONVEX_URL` is set correctly in `apps/web/.env.local`
2. Make sure Convex backend is running (`bun run dev` in packages/backend)
3. Check that the URL is `http://localhost:3210`

### Issue: Environment Variables Not Working

**Problem**: Environment variables aren't being loaded.

**Solution**:
1. Restart the development server after adding `.env.local`
2. Ensure variables are named correctly (with `VITE_` prefix for frontend)
3. Check that `.env.local` is in the correct directory

## Next Steps

### 1. Add More Authentication Providers

Extend `auth.ts` to include OAuth providers:

```typescript
import { GitHub } from "@convex-dev/auth/providers/GitHub";
import { Google } from "@convex-dev/auth/providers/Google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements: () => {},
    }),
    GitHub,
    Google,
  ],
});
```

### 2. Add User Profile Management

Create a profile page where users can update their information.

### 3. Implement Role-Based Access

Add roles to your user schema and implement authorization checks.

### 4. Add Email Verification

Configure Convex to send verification emails when users sign up.

## Summary

In this tutorial, we've built a complete authentication system using:

- **Convex** for backend authentication and database
- **TanStack Start** for the frontend framework
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **TypeScript** for type safety

The key concepts we've covered:

1. **Environment Setup**: Proper configuration for development
2. **Backend Auth**: Convex authentication configuration
3. **Database Schema**: Defining user data structure
4. **Frontend Integration**: Connecting React to Convex
5. **Protected Routes**: Ensuring only authenticated users can access certain features
6. **User Management**: Creating and managing user data

This foundation can be extended to build full-featured applications with user authentication, real-time data synchronization, and secure backend operations.