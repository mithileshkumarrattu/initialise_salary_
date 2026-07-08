# System Patterns & Architecture Rules

## Core Architectural Decisions

### 1. Single `/dashboard` Route with Role-Based Rendering

**Why**: Simplifies routing, all auth logic in one place, role detection centralized.

**How**:
```tsx
// /app/(app)/dashboard/page.tsx
const role = useRole(); // Detects DIRECTOR, HOD, FACULTY, FINANCE
return role === 'DIRECTOR' ? <DirectorDashboard /> 
     : role === 'HOD' ? <HodDashboard />
     : role === 'FACULTY' ? <FacultyDashboard />
     : role === 'FINANCE' ? <FinanceDashboard />
     : <AccessDenied />;
```

**What this means**:
- Users bookmark `/dashboard` only
- No route collisions
- Permission logic centralized in DashboardShell.tsx
- Easy to add new roles later

### 2. Three-State Component Pattern

**Pattern**: Every component that fetches data has THREE states.

```tsx
'use client';

const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const result = await queryFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

// RENDER LOGIC
if (loading) return <LoadingSkeleton />;
if (error) return <ErrorFallback message={error} />;
if (!data) return <EmptyState />;

return <YourContent data={data} />;
```

**Why**:
- Every user sees appropriate UI for every state
- No blank screens, no crashes on error
- Predictable behavior
- Easy to debug

### 3. Query Layer Centralization

**Rule**: ALL database access through `lib/db/queries/`.

**Why**:
- No mock data mixed into components
- Easy to refactor queries later
- Reusable across all pages
- Single source of truth

**Example**:
```tsx
// ✅ CORRECT - Component calls query function
const tasks = await getUnstructuredTasks();

// ❌ WRONG - Direct database call in component
const { data } = await supabase.from('unstructured_tasks').select('*');

// ❌ WRONG - Hardcoded mock data
const tasks = [{id: 1, title: 'Task 1'}, ...];
```

### 4. Permission-First Design

**Rule**: Wrap restricted features in RoleGate.

```tsx
<RoleGate requiredPermission="APPROVE_SALARY_TRANSFER">
  <SalaryTransferButton />
</RoleGate>
```

**Flow**:
1. RoleGate checks user.role from DB
2. Queries role_permissions table
3. If permission granted: render children
4. If not: render 403 or null

**Why**: Centralized permission logic, easy to audit, prevents accidental exposures.

### 5. Async API Routes for Side Effects

**Rule**: Any data modification goes through `/api/` routes, not direct DB calls from client.

**Why**:
- Auditable (every transaction logged)
- Secure (server validates permissions)
- Can trigger smart contracts
- Transactional (all-or-nothing)

**Example**:
```tsx
// Component
const approveTransfer = async (transferId) => {
  const response = await fetch('/api/approvals/salary-transfer', {
    method: 'POST',
    body: JSON.stringify({ transferId })
  });
  // ...
};

// API Route (/api/approvals/salary-transfer/route.ts)
export async function POST(request: Request) {
  // 1. Verify auth
  // 2. Check permissions
  // 3. Validate business logic
  // 4. Update database
  // 5. Call smart contract if needed
  // 6. Return success/error
}
```

### 6. CSS Token-Based Design System

**Rule**: NO hardcoded colors, sizes, or spacing.

```css
/* ✅ CORRECT */
.button {
  background-color: hsl(var(--primary));
  padding: var(--spacing-4);
  border-radius: var(--radius);
}

/* ❌ WRONG */
.button {
  background-color: #6d28d9;
  padding: 1rem;
  border-radius: 8px;
}
```

**Why**:
- Easy theme switching (just change CSS vars)
- Dark mode trivial (just override in `.dark` selector)
- Consistency enforced
- Designer can adjust one file, affects whole app

### 7. Role-Based Data Fetching

**Rule**: Fetch only data the user has permission to see.

```tsx
// ✅ CORRECT - Scoped to current user's department
const staffList = await getStaffByDepartment(currentUser.departmentId);

// ❌ WRONG - Fetching all users globally
const staffList = await getAllUsers();
```

**Why**:
- Security (no data leakage)
- Performance (smaller datasets)
- Privacy (follows GDPR principles)
- Audit-friendly (clear data access patterns)

### 8. Real-Time Subscriptions (Later Phase)

**Pattern** (Phase 3+):
```tsx
useEffect(() => {
  const subscription = supabase
    .channel(`tasks:${deptId}`)
    .on('postgres_changes', 
      { event: '*', table: 'unstructured_tasks' },
      (payload) => setTasks(prev => [...prev, payload.new])
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, [deptId]);
```

**Why**: When HOD approves a task, faculty sees it update instantly (no refresh needed).

---

## Naming Conventions

### Files & Folders

```
lib/db/queries/entities.ts      // Query functions grouped by entity
lib/hooks/useFeature.ts         // React hooks (use prefix)
lib/utils/helper.ts             // Utilities
components/feature/Component.tsx // Components (PascalCase)
src/app/(group)/route/page.tsx  // Pages (lowercase, hyphens for multi-word)
src/api/feature/route.ts        // API endpoints
```

### Functions

```
// Query functions: get[Entity][Filter]
getUnstructuredTasks(filters)
getTokenBalance(userId)
getStructuredTaskAttendance(taskId)

// API endpoints: POST /api/domain/action
POST /api/tasks/nominate
POST /api/approvals/attendance

// Hooks: use[Feature]
useAuth()
usePermissions()
useRole()

// Components: [Feature][Type]
DirectorDashboard
HodDashboard
TaskCard
NominationForm
```

### Variables

```
// User data
const user = getCurrentUser();  // Full user object
const userId = user.id;         // Just ID
const role = user.role;         // Just role

// Lists
const tasks = [];               // Plural for arrays
const task = tasks[0];          // Singular for single items

// Booleans
const isLoading = true;         // is/has prefix
const hasPermission = false;
const canApprove = true;

// State
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

---

## Error Handling Strategy

### Levels of Errors

**1. HTTP/Network Errors**
```tsx
try {
  const data = await fetch(...);
} catch (err) {
  setError('Network failed. Please check your connection.');
}
```

**2. Database Errors**
```tsx
try {
  const data = await getUnstructuredTasks();
} catch (err) {
  setError('Failed to load tasks. Refresh page or contact support.');
}
```

**3. Permission Errors**
```tsx
if (!hasPermission('APPROVE_TASKS')) {
  return <ErrorFallback message="You don't have permission to approve tasks." />;
}
```

**4. Validation Errors**
```tsx
if (faculty.progressPercentage < 85) {
  return <ErrorFallback message="Progress must be at least 85% to transfer salary." />;
}
```

### Error Messages (User-Friendly)

```
❌ DON'T: "TypeError: Cannot read property 'map' of undefined"
✅ DO: "Failed to load tasks. Please refresh the page."

❌ DON'T: "404 Not Found"
✅ DO: "This task doesn't exist. It may have been deleted."

❌ DON'T: "Forbidden"
✅ DO: "You don't have permission to approve this task."
```

---

## Testing Mental Model

### Three Questions to Ask Before Submitting Code

1. **Three States**: Does this component handle loading, error, and success states?
2. **No Mock Data**: Is all data fetched from database, not hardcoded?
3. **Permissions**: Are restricted features wrapped in RoleGate?

If answer is NO to any, fix before submitting.

---

## Performance Considerations

### What We Care About

- **Lazy Loading**: Load data on component mount, not on page load
- **Memoization**: Wrap expensive components with React.memo if they re-render unnecessarily
- **Query Optimization**: Use SELECT * sparingly, fetch only needed columns
- **Caching**: Supabase handles query caching by default
- **Bundle Size**: Import from tree-shakeable libraries (avoid large monolithic imports)

### What We DON'T Care About (Phase 1)

- Image optimization (no images yet)
- Code splitting (Next.js handles)
- Database indexes (Supabase handles)
- CDN caching (Vercel handles)

---

## Deployment Considerations

### Environment Variables

```
# .env.development.local (local development)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# .env.production (production deployment)
Same as above, but from production Supabase project
```

### Secrets Management

```
❌ Never commit .env files
✅ Add to .gitignore
✅ Use Vercel Secrets for production
✅ Use .env.development.local for local dev
```

---

## Git Workflow (For Team)

### Branch Naming
```
feature/director-dashboard
feature/hod-dashboard
fix/role-gate-permissions
docs/api-routes
```

### Commit Messages
```
"feat: build director dashboard with live data"
"fix: role gate not checking permissions correctly"
"refactor: centralize error handling in ErrorFallback"
"docs: update implementation_plan.md"
```

### PR Review Checklist
- [ ] Three states implemented (loading/error/success)
- [ ] No hardcoded data or mock values
- [ ] Permissions checked (RoleGate or permission hook)
- [ ] Follows naming conventions
- [ ] Design tokens used (no hardcoded colors)
- [ ] Error messages are user-friendly
- [ ] Tests pass (if applicable)

---

## Summary: The Mental Model

```
USER → AUTHENTICATE → ROLE DETECTED → DASHBOARD SHOWN
                          ↓
                    (Director/HOD/Faculty/Finance?)
                          ↓
                      COMPONENT LOADS
                          ↓
                   useEffect FIRES QUERY
                          ↓
                   DB RETURNS REAL DATA
                          ↓
                    THREE STATES RENDER
                  Loading → Success/Error
                          ↓
                  USER SEES ACTUAL INFO
```

This is the flow for every single page in the application.

