# Work Token Platform - Development Guide

## Golden Rules

1. **NO mock data anywhere** — not in components, APIs, or defaults
2. **ALL data from Supabase** — every component fetches real data
3. **THREE states mandatory** — loading, error, success for every async operation
4. **Queries in `/lib/db/queries/`** — organized by entity, reusable
5. **Design tokens only** — no hardcoded colors or spacing
6. **RoleGate wrappers** — permission checks on restricted features
7. **Error handling + retry** — graceful failures with user feedback
8. **Type-safe components** — full TypeScript, no `any` types

---

## Project Structure

```
src/
├── app/(auth)/              # Login, signup (public)
├── app/(app)/               # Protected routes (auth required)
│   ├── dashboard/           # Role-based dashboard (single route)
│   ├── my-work/
│   ├── task-pool/
│   ├── team/
│   ├── finance/
│   ├── approvals/
│   └── layout.tsx           # Auth middleware
├── api/                     # Server endpoints
├── lib/
│   ├── db/queries/          # Database query functions (organized by entity)
│   ├── supabase/            # Supabase clients
│   ├── hooks/               # React hooks (auth, permissions, role)
│   └── utils/
├── components/
│   ├── layout/              # AppSidebar, AppNavbar, RoleGate
│   ├── dashboard/           # Role-specific dashboards
│   ├── tasks/               # Task components
│   └── common/              # LoadingSkeleton, ErrorFallback
├── globals.css              # Design tokens + Tailwind directives
└── DEVELOPMENT.md           # This file
```

---

## Three-State Component Pattern (Template)

Copy this for every data-fetching component:

```typescript
'use client';
import React, { useEffect, useState } from 'react';
import { getDataFromDatabase } from '@/lib/db/queries/entity';

export default function MyComponent() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDataFromDatabase();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Add dependencies if needed

  // Render three states
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} onRetry={() => window.location.reload()} />;
  if (!data) return <EmptyState message="No data found" />;

  // Success: Render with live data
  return <div>{/* Use data here */}</div>;
}
```

---

## Query Layer Organization

**Location**: `/lib/db/queries/`

Queries are organized by entity, not by page. Every query function:
- Handles errors (throws on failure)
- Returns typed data
- Has no mock data fallbacks

```typescript
// lib/db/queries/tasks.ts
import { createClient } from '@/lib/supabase/client';

export async function getUnstructuredTasks(
  deptId: string,
  status?: 'OPEN' | 'NOMINATED' | 'ASSIGNED' | 'COMPLETED'
) {
  const supabase = createClient();
  let query = supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('department_id', deptId);
  
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query.order('priority', { ascending: false });
  
  if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
  return data || [];
}
```

---

## Permission Gating with RoleGate

Wrap permission-restricted features:

```typescript
import { RoleGate } from '@/components/layout/RoleGate';

export function ApprovalPanel() {
  return (
    <RoleGate requiredPermission="approve_attendance">
      <div>
        {/* Only shows if user has permission */}
        <AttendanceApprovalForm />
      </div>
    </RoleGate>
  );
}
```

---

## Design System: CSS Tokens

All styling uses design tokens defined in `globals.css`:

```css
/* Color tokens */
--primary: 7 89% 53%;              /* Purple #6d28d9 */
--success: 142 76% 36%;            /* Green #16a34a */
--warning: 38 92% 50%;             /* Orange #f97316 */
--error: 0 84% 60%;                /* Red #ef4444 */
--background: 0 0% 100%;           /* White */
--foreground: 224 71% 4%;          /* Near-black */

/* Spacing tokens */
--spacing-2: 0.5rem;
--spacing-4: 1rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;
```

**Usage in components**:
```tsx
// ✅ DO: Use semantic tokens
<div className="bg-primary text-primary-foreground p-4 rounded-lg gap-6">

// ❌ DON'T: Hardcode colors
<div className="bg-purple-600 text-white p-[16px]">
```

---

## Real-Time Updates (Optional)

For live updates (e.g., task status changes):

```typescript
useEffect(() => {
  const subscription = supabase
    .channel(`tasks:${deptId}`)
    .on('postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'unstructured_tasks',
        filter: `department_id=eq.${deptId}`
      },
      (payload) => {
        // Update state when DB changes
        setTasks(prev => {
          if (payload.eventType === 'INSERT') {
            return [...prev, payload.new];
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map(t => t.id === payload.new.id ? payload.new : t);
          }
          return prev;
        });
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, [deptId]);
```

---

## Debugging

Use `console.log("[v0] ...")` to debug:

```typescript
console.log("[v0] Fetching tasks for dept:", deptId);
const data = await getUnstructuredTasks(deptId);
console.log("[v0] Fetched tasks:", data);
```

Remove these logs before committing.

---

## Common Patterns

### Multi-Query Coordination
```typescript
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const [user, tasks, progress] = await Promise.all([
        getUserData(userId),
        getUserTasks(userId),
        getUserProgress(userId),
      ]);
      setUser(user);
      setTasks(tasks);
      setProgress(progress);
    } catch (err) {
      setError(err.message);
    }
  };
  loadDashboard();
}, [userId]);
```

### Conditional Rendering Based on Data
```typescript
<div className={cn(
  "p-4 rounded-lg",
  task.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'
)}>
  {task.title}
</div>
```

### Form Submission with Mutation
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    await createAttendanceRecord(data);
    toast.success('Attendance marked');
    // Optionally refetch list
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## DO's & DON'Ts

### ✅ DO

- Fetch in `useEffect` with proper dependencies
- Handle three states (loading/error/success)
- Use `RoleGate` for permission checks
- Organize queries in `/lib/db/queries/`
- Throw errors from query functions
- Use design tokens for all styling
- Map over live data from queries
- Add error recovery (retry buttons)

### ❌ DON'T

- Hardcode data in components
- Use mock/seed data as defaults
- Fetch without error handling
- Skip permission checks
- Inline Supabase queries in components
- Use arbitrary Tailwind values (`p-[16px]`, `gap-[24px]`)
- Render before checking permissions
- Leave `console.log` statements in production code

---

## Phase 1 Checklist (Current)

- [ ] Folder structure reorganized
- [ ] Design system (CSS tokens) implemented
- [ ] Query layer (`lib/db/queries/`) set up
- [ ] Base layouts (Sidebar, Navbar) created
- [ ] RoleGate permission wrapper built
- [ ] Dashboard role detection working
- [ ] LoadingSkeleton & ErrorFallback components
- [ ] Auth middleware enforcing
- [ ] This DEVELOPMENT.md guide complete

---

## Quick Start

1. **Create a new component**:
   - Copy the three-state template above
   - Import a query function from `/lib/db/queries/`
   - Fetch on mount, handle loading/error/success

2. **Add a new query**:
   - Add function to `/lib/db/queries/` file (by entity)
   - Handle errors, return typed data
   - Export from `lib/db/queries/index.ts`

3. **Restrict access**:
   - Wrap component in `<RoleGate requiredPermission="..." />`

4. **Style components**:
   - Use design tokens: `bg-primary`, `text-foreground`, `p-4`
   - Never hardcode colors or spacing

---

Follow this guide for all development. Every component, every page, every query should follow these patterns.
