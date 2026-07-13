# AI Agent Quick Reference - WorkToken Platform

**Print this. Bookmark this. Reference this constantly.**

---

## GOLDEN RULES (ABSOLUTE - NO EXCEPTIONS)

```
1. ZERO MOCK DATA
   ❌ const mockTasks = [{id: 1, name: 'Task 1'}]
   ✅ const tasks = await getUnstructuredTasks()

2. THREE STATES ALWAYS
   ❌ if (data) return <Component data={data} />
   ✅ if (loading) return <LoadingSkeleton />
      if (error) return <ErrorFallback />
      if (empty) return <EmptyState />
      return <Component data={data} />

3. QUERY LAYER CENTRALIZATION
   ❌ const res = await supabase.from('tasks').select('*')
   ✅ const tasks = await getUnstructuredTasks()

4. ROLE GATE WRAPPER
   ❌ {user.role === 'HOD' && <ApprovalPanel />}
   ✅ <RoleGate requiredPermission="APPROVE"><ApprovalPanel /></RoleGate>

5. CSS TOKENS ONLY
   ❌ className="bg-[#817AFF] text-[#F2E030]"
   ✅ className="bg-primary text-foreground-dark"

6. TYPE SAFE
   ❌ function getData() { ... }
   ✅ function getData(): Promise<UnstructuredTask[]> { ... }

7. AUDIT IMMUTABLE
   ✅ Every transaction logged in database + blockchain
   ✅ No deletions (only soft deletes with reason)
```

---

## DESIGN TOKENS (Copy This)

### Colors (One UI)
```
Primary:        #817AFF (purple for actions)
Secondary:      #844A87 (darker purple, hover states)
Success:        #00C853 (green, approved status)
Warning:        #FFC30C (yellow, pending status)
Error:          #FF3B30 (red, rejected/error)
Accent (Galaxy):#00D4FF (cyan, highlights)

Dark Mode:
  Foreground:   #F2E030 (text)
  Background:   #000000 (page)
  Container:    #1717A1A (cards)
  Border:       #3D3D5C (dividers)
  Muted:        #A0A0B3 (secondary text)

Light Mode (inverses):
  Foreground:   #1A1A1A (text)
  Background:   #FFFFFF (page)
  Container:    #EFEFFF (cards)
  Border:       #E5E5E8 (dividers)
  Muted:        #6C6C7A (secondary text)
```

### Typography
```
Title:        36px, 700 Bold,  leading-tight (-0.5px letter-spacing)
Heading:      24px, 600 Semi,  leading-snug
Subtitle:     20px, 700 Bold,  leading-relaxed
Subheading:   16px, 400 Reg,   leading-relaxed
Body:         14px, 400 Reg,   leading-relaxed
Caption:      12px, 400 Reg,   leading-relaxed

Font: Variable One UI Sans (custom)

RULE: Use .text-title, .text-heading, etc. NOT manual sizes
```

### Spacing
```
Base: 8px grid

p-2 = 8px      p-4 = 16px    p-6 = 24px
p-8 = 32px     p-12 = 48px   p-16 = 64px

gap-4 = 16px (default between sections)
gap-2 = 8px  (small gaps)
gap-8 = 32px (large section gaps)

RULE: Never use p-[17px] or arbitrary values
```

### Radius
```
Buttons:      rounded-lg   (8px)
Cards:        rounded-xl   (12px)
Modals:       rounded-3xl  (24px)
Inputs:       rounded-lg   (8px)
Avatars:      rounded-full (50%)
```

### Shadows & Blur
```
Cards:              shadow-lg
Hover cards:        hover:shadow-xl
Dialog backgrop:    bg-black/60 backdrop-blur-2xl
Light mode dialog:  bg-white/50 backdrop-blur-2xl
```

---

## FILE STRUCTURE

```
/app
  /dashboard
    page.tsx          ← Role detection → render role-specific dashboard
  /auth
    /login
      page.tsx        ← Public login
    /signup
      page.tsx        ← Public signup
  /my-work
    page.tsx          ← Faculty portfolio
  /task-pool
    page.tsx          ← Browse tasks
  /team
    page.tsx          ← HOD team view
  /approvals
    page.tsx          ← Approval queue
  layout.tsx          ← Root layout (fonts, theme, navigation)
  api/
    /attendance/
      /mark
        route.ts      ← PATCH /api/attendance/mark
    /salary/
      /initiate
        route.ts      ← POST /api/salary/initiate
    /admin/           ← Only director can access

/components
  /faculty-dashboard/
    ProgressRing.tsx
    TodayScheduleCard.tsx
    MyNominationsCard.tsx
    TokenBalanceWidget.tsx
    InitiateSalaryButton.tsx
  /shared/
    LoadingSkeleton.tsx
    ErrorFallback.tsx
    EmptyState.tsx
    RoleGate.tsx
  /ui/
    (shadcn components)

/lib
  /db
    /queries/
      faculty.ts         ← All faculty queries
      structured-tasks.ts ← All class queries
      unstructured-tasks.ts ← All task queries
      approvals.ts       ← All approval queries
      director.ts        ← All director queries
      finance.ts         ← All finance queries
    db.ts              ← Connection setup

/types
  index.ts            ← All TypeScript types

/styles
  globals.css         ← Design tokens, component classes
```

---

## QUERY LAYER (Know These Functions)

### Faculty Queries
```
getFacultyProgressData(userId)        → {progress%, balance, loan}
getTodayClassSchedule(userId)         → StructuredTask[]
getMyTaskNominations(userId)          → TaskNomination[]
getStructuredTaskAttendance(userId)   → Attendance[]
getTokenBalance(userId)               → {balance, tokens_available}
```

### Structured Task Queries
```
getStructuredTasksByFaculty(userId)   → StructuredTask[]
getTodayClassSchedule(userId)         → StructuredTask[] (filtered today)
markAttendance(taskId, userId)        → {success, updatedProgress}
```

### Unstructured Task Queries
```
getUnstructuredTasks(filters?)        → UnstructuredTask[] (OPEN only)
getMyNominations(userId)              → TaskNomination[]
getNominationCount(taskId)            → {count, nominees: User[]}
submitProof(nominationId, proof)      → {success, status}
```

### Approval Queries
```
getPendingApprovals(hodId)            → {tasks, transfers, attendance}
getPendingTaskCompletions(hodId)      → TaskNomination[] (need approval)
getPendingSalaryTransfers(role)       → SalaryTransfer[] (pending)
getPendingAttendanceBatches(hodId)    → AttendanceBatch[]
```

### Director Queries
```
getOrgStats()                         → {tokens_minted, faculty_count, avg%}
getAllDepartmentsWithStats()          → Department[] with stats
getTokenTransactionHistory()          → Transaction[] (audit trail)
mintTokens(amount, budget)            → {success, tx_hash}
```

### Finance Queries
```
getAllFacultyWithTokenBalance()       → User[] with balance
getPendingFinanceApprovals()          → SalaryTransfer[] (HOD_APPROVED)
releaseSalary(transferId)             → {tx_hash, success}
getTransactionHistory()               → Transaction[] (all releases)
```

---

## COMPONENT PATTERNS (Copy & Paste)

### Three-State Wrapper Component
```tsx
export function MyComponent() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const result = await getMyQueryFunction();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback error={error} onRetry={/* refetch */} />;
  if (!data) return <EmptyState title="No data found" />;
  
  return <ActualComponent data={data} />;
}
```

### RoleGate Wrapper
```tsx
<RoleGate requiredPermission="APPROVE_TASKS">
  <ApprovalPanel />
</RoleGate>

// Inside RoleGate component:
if (!user.hasPermission(requiredPermission)) {
  return <AccessDenied />;
}
return children;
```

### Loading Skeleton
```tsx
export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded-lg bg-container-dark"></div>
      <div className="h-4 w-full animate-pulse rounded-lg bg-container-dark"></div>
      <div className="h-4 w-1/2 animate-pulse rounded-lg bg-container-dark"></div>
    </div>
  );
}
```

### Error Fallback
```tsx
export function ErrorFallback({ 
  error, 
  onRetry 
}: { 
  error: Error; 
  onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border-l-4 border-error bg-error/10 p-4">
      <h3 className="font-semibold text-error">Error loading data</h3>
      <p className="text-sm text-foreground-dark">{error.message}</p>
      <button 
        onClick={onRetry} 
        className="btn-primary mt-2"
      >
        Retry
      </button>
    </div>
  );
}
```

### Empty State
```tsx
export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-subtitle">{title}</h3>
      <p className="text-body text-muted mt-2">{description}</p>
    </div>
  );
}
```

---

## DEBUGGING CHECKLIST

### Page is blank
- [ ] Check browser console for errors
- [ ] Verify RoleGate isn't blocking (check role permission)
- [ ] Add console.log in component to see if it renders
- [ ] Check Network tab - are API calls happening?

### Data not showing
- [ ] Verify query function returns data (test in db.ts)
- [ ] Check component receives props correctly
- [ ] Verify map() has key prop on elements
- [ ] Check state is updating (use React DevTools)

### Styling wrong
- [ ] Verify token is defined in globals.css
- [ ] Check Tailwind class is spelled correctly
- [ ] Inspect element in DevTools to see actual CSS
- [ ] Is dark/light mode toggling correct?

### Button doesn't work
- [ ] Check onClick handler is attached
- [ ] Verify API endpoint is correct (Network tab)
- [ ] Check permissions (RoleGate wrapper)
- [ ] Look for errors in browser console

### API call failing
- [ ] Check route exists in /app/api/
- [ ] Verify method matches (GET/POST/PATCH)
- [ ] Check authentication header is sent
- [ ] Verify query parameters are correct
- [ ] Look for 404, 403, 500 errors in Network tab

---

## TESTING CHECKLIST (Before Marking Done)

```
□ Component loads with real data (not mock)
□ Loading state shows skeleton (no blank page)
□ Error state shows with retry button
□ Empty state shows when no data
□ All buttons/interactions work
□ Data updates reflect immediately or after refresh
□ Mobile responsive (320px, 768px, 1024px)
□ All colors match One UI spec
□ All typography matches spec
□ No hardcoded colors or margins
□ Accessible: tab navigation works, labels present, focus visible
□ No console errors or warnings
□ Role permissions working (can't access restricted areas)
```

---

## COMMON MISTAKES (Avoid These)

```
❌ Hardcoding mock data in components
❌ Using role check directly instead of RoleGate
❌ Skipping loading state (showing blank page while loading)
❌ Not showing error state (showing broken page instead)
❌ Using hardcoded colors like #817AFF instead of bg-primary
❌ Creating arbitrary Tailwind classes like p-[17px]
❌ Mixing margin and gap on same element
❌ Forgetting TypeScript types (using `any`)
❌ Not wrapping async operations in try-catch
❌ Forgetting key prop on mapped elements
❌ Not checking component prop types at runtime
❌ Using `map()` without key causing React warnings
```

---

## QUICK COMMAND REFERENCE

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm tsc --noEmit

# Format code
pnpm format

# Run tests (if set up)
pnpm test

# Check for linting errors
pnpm lint
```

---

## DATABASE SETUP (For Reference)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  role ENUM('DIRECTOR', 'HOD', 'FACULTY', 'FINANCE') NOT NULL,
  department_id UUID REFERENCES departments(id),
  progress_percentage DECIMAL(3,2),
  token_balance DECIMAL(10,2)
);

-- Structured tasks (classes)
CREATE TABLE structured_tasks (
  id UUID PRIMARY KEY,
  faculty_id UUID REFERENCES users(id),
  subject VARCHAR NOT NULL,
  attendance_marked BOOLEAN DEFAULT false
);

-- Unstructured tasks
CREATE TABLE unstructured_tasks (
  id UUID PRIMARY KEY,
  posted_by_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  token_value DECIMAL(10,2),
  status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED')
);

-- Task nominations
CREATE TABLE task_nominations (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES unstructured_tasks(id),
  faculty_id UUID REFERENCES users(id),
  status ENUM('PENDING', 'ASSIGNED', 'COMPLETED', 'REJECTED')
);

-- Salary transfers
CREATE TABLE salary_transfers (
  id UUID PRIMARY KEY,
  faculty_id UUID REFERENCES users(id),
  amount_tokens DECIMAL(10,2),
  status ENUM('INITIATED', 'HOD_APPROVED', 'FINANCE_APPROVED', 'COMPLETED'),
  tx_hash VARCHAR (blockchain proof)
);
```

---

## ENVIRONMENT VARIABLES NEEDED

```
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Blockchain
ETHEREUM_RPC_URL=https://rpc.mainnet.com
SMART_CONTRACT_ADDRESS=0x...
DIRECTOR_WALLET_PRIVATE_KEY=0x...

# Email notifications
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...

# Optional: Monitoring
SENTRY_DSN=...
```

---

## READING ORDER (ABSOLUTE)

For **every new agent** joining this project:

1. **THIS FILE** - 10 minutes (quick reference)
2. **MASTER_PROMPT_FOR_AGENTS.md** - 30 minutes (full context)
3. **DESIGN_SYSTEM_SETUP.md** - 20 minutes (styling)
4. **implementation_plan.md** - 1 hour (complete spec)
5. **SYSTEM_DIAGRAMS.md** - 30 minutes (architecture)
6. **PAGE_BUILDING_TEMPLATE.md** - 20 minutes (page structure)

**Total: 2.5 hours before writing code**

If you skip steps, you will hallucinate. If you read all, you will build correctly.

---

## CRITICAL WARNING

**If any of these are true, STOP and read the full docs:**

- You're about to create mock data → ❌ Stop. Read MASTER_PROMPT again.
- You're checking user.role in JSX → ❌ Stop. Use RoleGate wrapper.
- You're hardcoding a color → ❌ Stop. Use CSS tokens.
- You're unsure about the page structure → ❌ Stop. Read implementation_plan.md
- You're skipping loading state → ❌ Stop. Follow three-state pattern.
- You don't understand approval flow → ❌ Stop. Read SYSTEM_DIAGRAMS.md

**Every hallucination comes from incomplete reading. Read everything first. Build second.**

---

**Last Updated**: July 8, 2026
**Version**: 1.0 - Quick Reference for Agents
**Critical**: Print and reference constantly. Do not deviate from these rules.
