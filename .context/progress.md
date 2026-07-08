# Progress

## What is built
- Next.js 15 App Router scaffolding.
- Supabase SSR integration and client utils.
- Functional Google OAuth login flow (with automatic `public.users` table insertion on callback).
- Clean Shadcn UI standard layout setup without forced dark mode.
- Barebone routing structure (`dashboard`, `my-work`, `task-pool`, etc.) all protected by active session checks.

## What is broken / removed
- All previous mocked dashboard components (`_components/` in dashboard) have been bypassed and deprecated.
- The "simulate role" feature is gone.
- Custom Tailwind color overrides (`emerald-500`, `slate-950`) are eliminated in favor of standard design tokens.

## What is left
- Rebuild the dashboard components dynamically from the ground up, fetching directly from the Supabase DB.
- Rebuild the Task Pool board securely and dynamically.
- Implement the actual role-based logic based off `public.users.role`.
- Finalize the layout shell (Sidebar/Navbar) with proper navigation.
