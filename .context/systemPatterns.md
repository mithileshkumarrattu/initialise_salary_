# System Patterns

## Architecture
- **Framework:** Next.js 15+ App Router.
- **Backend/DB:** Supabase (PostgreSQL + Auth).
- **Styling:** Tailwind CSS with strict Shadcn UI primitives.
- **State/Data Fetching:** Standard React Hooks (`useEffect`, `useState`) wrapped around `@supabase/supabase-js` client.

## Tech Stack Rules
- **No Mock Data:** All application views must dynamically render using real data from the database.
- **Shadcn First:** Do not arbitrarily use custom Tailwind hexes or gradients unless absolutely necessary. Rely on `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.
- **Authentication:** All protected routes in `(app)` must verify the session using `await supabase.auth.getUser()`. If no user exists, redirect to `/login`.
- **Role Base Access:** Application logic must derive from the user's role defined in the `public.users` table, not from client-side simulated state.

## Folder Structure
- `src/app/(auth)`: Public routes for login and onboarding.
- `src/app/(app)`: Authenticated routes for the core platform (Dashboard, Task Pool, etc.).
- `src/utils/supabase/`: Supabase client and server configuration files.
