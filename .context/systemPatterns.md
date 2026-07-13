# System Patterns
*Last Updated: 2026-07-09T02:35:00+05:30*

## Architecture & Tech Stack
- Next.js (App Router), React, TypeScript.
- Supabase (Postgres Database, Auth, Edge Functions).
- Tailwind CSS with custom One UI CSS tokens (no hardcoded colors).
- Lucide React for icons.

## Golden Rules
1. **ZERO Mock Data**: All components must fetch real data via Supabase. If data does not exist, an "Empty State" component must be rendered instead of arbitrary mock text.
2. **Three-State Pattern**: Every async component must have:
   - A Loading state (`LoadingSkeleton`).
   - An Error state (`ErrorFallback` with retry).
   - A Success state (content with real data).
3. **RoleGate**: Use `<RoleGate requiredPermission="[...]">` to wrap restricted views instead of evaluating `userRole === 'admin'` inline within JSX.
4. **Centralized Queries**: All database fetch calls must be placed in `lib/db/queries/[domain].ts`, maintaining a clean separation of concerns away from UI components.
5. **UI Standard**: Use CSS tokens (`bg-primary`, `text-foreground-dark`, etc.) defined in `globals.css`. Never use arbitrary hex codes.

## Database Models (From `SYSTEM_DIAGRAMS.md`)
- `users`: Core profile and token balance tracking.
- `structured_tasks`: Fixed work like classes with attendance tracking.
- `unstructured_tasks`: Flexible work (mentoring, projects) posted by HODs.
- `task_nominations`: Application lifecycle for unstructured tasks (Pending → Assigned → Proof Submitted → Completed).
- `salary_transfers`: Fiat payout request tracking across Faculty → HOD → Finance approval chain.
