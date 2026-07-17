# CONTEXT TRANSFER PROMPT - Paste This Entire Message Into New Thread

## ⚠️ READ THIS FIRST BEFORE ANYTHING ELSE

You are building **WorkToken** - a token-based work attribution system for academic institutions. 

**CRITICAL RULES:**
1. DO NOT INVENT OR HALLUCINATE - all requirements are in MASTER_ARCHITECTURE_GUIDE.md
2. All roles have different sidebars, dashboards, and permissions - READ THE FULL ROLE SPECIFICATION
3. Never hardcode colors - use CSS variables from design tokens
4. All data modifications must create audit_logs entries (immutable trail)
5. Role-based filtering must happen at the QUERY LEVEL, not in components
6. All dashboards must show three states: loading, error, success

---

## Project Structure

**Repo**: mithileshkumarrattu/initialise_salary_
**Main Branch**: v0/(username)-(hash)
**Tech Stack**: Next.js 16, Supabase, TypeScript, Tailwind CSS

```
/src
  /app
    /(app)           # Protected routes (wrapped by middleware + RoleGate)
      /layout.tsx    # Sidebar + main layout
      /dashboard     # Dynamic dashboard per role
      /my-work       # Faculty/HOD personal tasks
      /task-pool     # Open tasks for nomination/assignment
      /approvals     # Role-specific approvals
      /team          # HOD/Director team management
      /finance       # Finance dashboard
      /settings      # Admin settings
      /audit         # Admin audit logs
      /profile       # User profile
    /(auth)          # Public routes (no auth required)
      /login
      /signup
  /components
    /admin           # Admin-only components
    /director        # Director-only components
    /hod             # HOD-only components
    /faculty         # Faculty-only components
    /finance         # Finance-only components
    /shared          # RoleGate, LoadingState, ErrorState
    /layout          # AppSidebar, AppLayout
  /lib
    /db
      /queries       # Role-based query files
        /admin.ts
        /director.ts
        /hod.ts
        /faculty.ts
        /finance.ts
    /hooks
      /useAuth.ts    # Get current Supabase user
      /useRole.ts    # Get user's role from DB
    /supabase
      /client.ts     # Browser client
      /server.ts     # Server client (use in Server Components)
  /middleware.ts     # Session validation + role fetching
```

---

## 5 Core Roles (Read MASTER_ARCHITECTURE_GUIDE.md Section 1 for FULL details)

### 1. ADMIN (System Administrator)
**Sidebar**: Dashboard | Settings | Audit Log

**Permissions**: users.manage, organizations.configure, rate_cards.manage, blockchain.configure, audit.view

**Dashboard Components**:
- OrgTreeBuilder (drag-drop org hierarchy)
- UserManagementTable (CRUD users + bulk import)
- RateCardEditor (token rates by role/task type)
- BlockchainConfig (smart contract settings)
- AuditLogViewer (immutable action trail)

**Key Actions**:
- Create/edit/deactivate departments
- Assign HODs to departments
- Create/edit/delete users
- Modify token rates
- View all audit logs (no delete allowed)

### 2. DIRECTOR (Institutional Leader)
**Sidebar**: Dashboard (only)

**Permissions**: dashboard.view_org, tokens.mint, loans.approve, reports.view_all, audit.view

**Dashboard Components**:
- KPI Cards (total minted, faculty-held tokens, reversed this month, below-threshold count)
- TokenFlowChart (donut: breakdown by transaction type)
- DepartmentHeatmap (completion %, avg tokens, utilization by dept)
- LoansTable (active loans with age + flag button)
- LoanApprovalPanel (pending loans: approve/reject)

**Key Actions**:
- Approve/reject work loan requests
- View org-wide metrics and heatmaps
- Flag underperformers for HR review

### 3. HOD (Head of Department)
**Sidebar**: Dashboard | My Work | Task Pool | Approvals | Team | Settings

**Permissions** (Manager):
- tasks.create (post to dept pool)
- tasks.assign (allocate to faculty)
- tasks.verify (verify completion proof)
- approvals.approve_attendance (batch approve weekly)
- approvals.approve_salary (sign off salary transfers)
- team.view (dept members + progress)
- team.flag (flag underperformers)

**Permissions** (Employee - if HOD is also faculty):
- profile.view_own
- tasks.submit_attendance
- tasks.nominate
- tasks.complete
- salary.initiate
- loans.request

**Dashboard Components**:
1. Personal Section (if HOD is faculty):
   - ProgressRing (token progress %)
   - ActionButton (Initiate Salary / Request Loan)
   - TodaySchedule (today's classes with attendance buttons)

2. Manager Section (Tabs):
   - **Approvals Tab**: AttendanceApprovalTable + SalaryTransferApprovals
   - **Task Pool Tab**: Kanban (OPEN → NOMINATED → ASSIGNED → IN_PROGRESS → COMPLETED → VERIFIED)
   - **Team Tab**: TeamHeatmap + drill-down to member details

**Key Actions**:
- Create unstructured tasks for dept
- Assign tasks from nominees
- Batch approve weekly attendance
- Approve salary token transfers
- Verify task completion proofs
- View dept member progress + loan status
- Flag underperformers

### 4. FACULTY (Teaching Staff)
**Sidebar**: Dashboard | My Work | Task Pool

**Permissions**:
- profile.view_own
- tasks.view_own (personal structured + unstructured)
- tasks.submit_attendance (mark own classes)
- tasks.nominate (self-nominate for open tasks)
- tasks.complete (submit proof)
- salary.initiate (transfer tokens when threshold met)
- loans.request (apply for work loan)

**Dashboard Components**:
- ProgressRing (current tokens / threshold, colored green/red)
- ActionButton (if above threshold: "Initiate Salary" | if below: "Request Loan")
- TodaySchedule (classes today with "Mark Attendance" button)
- ActiveCommitments (unstructured tasks assigned to me)
- TokenBalanceWidget (token balance + last 3 transfers)
- LoanAlert (active loan status or "No active loans")

**Key Actions**:
- Mark attendance for classes (present/absent)
- Self-nominate for open unstructured tasks
- Submit proof for assigned tasks
- Request salary transfer when above threshold
- Request work loan when below threshold
- View personal token balance and transaction history

### 5. FINANCE (Finance Department Head)
**Sidebar**: Dashboard | Finance | Approvals | Audit Log

**Permissions**:
- finance.view (token balances, transaction history)
- finance.reverse_transfer (batch reversal on salary day)
- audit.view (financial transactions only)

**Dashboard Components**:
- KPI Cards (total minted, tokens held by faculty, ready for reversal, transaction volume)
- Director Wallet Balance (shows director's token_balance)
- "Trigger Batch Reverse Transfer" Button (loops through all faculty, reverses tokens back to director)
- Transaction Log (all token_transactions, filterable by type + date)
- Salary Transfer Summary (by dept: total transferred, faculty count, pending count)

**Key Actions**:
- View all token transactions
- Trigger batch reverse transfer (moves tokens from faculty wallets back to director)
- Export salary report (CSV/PDF for payroll)

---

## Database Schema (Use EXACTLY as specified in SQL file)

**Core Tables**:
- `organizations` (id, name, type, logo_url, created_at)
- `departments` (id, organization_id, name, hod_id, created_at)
- `users` (id, organization_id, department_id, email, name, role, token_balance, loan_balance, progress_percentage, wallet_address, created_at)
- `roles` (id, organization_id, name, is_system_role, created_at)
- `permissions` (id, scope, action, description)
- `role_permissions` (role_id, permission_id)
- `user_roles` (user_id, role_id)
- `permission_overrides` (user_id, permission_id, is_allowed)

**Tasks**:
- `structured_tasks` (id, user_id, task_type, subject, date, time_slot, attendance_present, attendance_absent, status, credits_earned, approved_by, created_at)
- `unstructured_tasks` (id, organization_id, department_id, title, description, token_points, creator_id, assigned_to_id, required_skills, deadline, priority, status, created_at)
- `nominations` (id, task_id, user_id, message, status, created_at)
- `task_proofs` (id, task_id, user_id, file_url, description, submitted_at, verified, verified_by)

**Financial**:
- `token_transactions` (id, organization_id, from_user_id, to_user_id, amount, type, tx_hash, status, timestamp)
- `loans` (id, organization_id, user_id, amount, remaining, reason, approved_by, status, created_at, cleared_at)
- `attendance_batches` (id, organization_id, hod_id, department_id, week_start, week_end, status, approved_at)

**Config**:
- `rate_cards` (id, organization_id, task_type, tokens_per_hour, role_multipliers, effective_date, is_active)
- `semester_calendars` (id, organization_id, name, start_date, end_date, marking_periods, is_active)

**Audit**:
- `audit_logs` (id, organization_id, actor_id, action, entity_type, entity_id, state_before, state_after, timestamp) - **IMMUTABLE, NEVER DELETE**

**Enums**:
- `task_status_structured`: UPCOMING, COMPLETED, PENDING_APPROVAL, APPROVED, REJECTED
- `task_status_unstructured`: OPEN, NOMINATED, ASSIGNED, IN_PROGRESS, COMPLETED, VERIFIED, REJECTED
- `nomination_status`: PENDING, ACCEPTED, REJECTED
- `transaction_type`: MINT, SALARY_TRANSFER, LOAN_ISSUE, REVERSE_TRANSFER, LOAN_REPAY, TASK_REWARD, BONUS, BURN
- `loan_status`: PENDING, ACTIVE, REPAID, DEFAULTED
- `attendance_batch_status`: DRAFT, SUBMITTED, APPROVED

---

## CRITICAL IMPLEMENTATION PATTERNS

### 1. Role-Based Query Filtering (NOT in components)
```typescript
// ✅ CORRECT: Filter at query level
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('department_id', userDepartmentId)  // Only show dept tasks
  .eq('status', 'OPEN');

// ❌ WRONG: Filter in component
tasks.filter(t => t.department_id === userDepartmentId)
```

### 2. Audit Logging (Every action that modifies data)
```typescript
// After any CREATE/UPDATE/DELETE:
await supabase.from('audit_logs').insert({
  organization_id: orgId,
  actor_id: userId,  // Who did it
  action: 'task_created',
  entity_type: 'unstructured_tasks',
  entity_id: newTaskId,
  state_before: null,
  state_after: { title, description, token_points, ... },
  timestamp: new Date(),
});
```

### 3. Three-State Components (ALL components must handle this)
```typescript
'use client';

export function MyComponent() {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  if (state === 'loading') return <LoadingState />;
  if (state === 'error') return <ErrorState message={error} onRetry={...} />;
  
  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

### 4. RoleGate Access Control (Wrap sensitive components)
```typescript
<RoleGate permission={{ scope: 'users', action: 'manage' }}>
  <UserManagementTable />
</RoleGate>

// If user lacks permission, shows error message + nothing renders
```

### 5. No Hardcoded Colors (Use CSS variables from globals.css)
```typescript
// ❌ WRONG
<div className="bg-[#8F7AFF]">Text</div>

// ✅ CORRECT
<div className="bg-primary">Text</div>
// Defined in globals.css: --primary: #8F7AFF;
```

---

## File Locations You Need

**Read These First**:
1. `/MASTER_ARCHITECTURE_GUIDE.md` - Complete spec (THIS IS YOUR BIBLE)
2. `/PAGE_STRUCTURE_COMPLETE.md` - Page routing & components (if exists)
3. `/ONEUI_DESIGN_TOKENS.md` - Color/font system

**Start Building Here**:
1. `src/lib/db/queries/admin.ts` - All admin queries
2. `src/components/admin/AdminDashboard.tsx` - Admin dashboard
3. `src/app/(app)/dashboard/page.tsx` - Main dashboard router
4. Then repeat for each role

**Already Fixed**:
- `src/lib/hooks/useRole.ts` - Now correctly fetches role from DB
- `src/components/layout/AppSidebar.tsx` - Now role-specific menus
- `src/app/(app)/layout.tsx` - Sidebar integration working

---

## Next Steps (In Order)

### Phase 2: Admin Dashboard (NEXT)
1. Copy `MASTER_ARCHITECTURE_GUIDE.md` Section 1.1 (Admin role)
2. Create `src/lib/db/queries/admin.ts` with all admin queries
3. Create `src/components/admin/AdminDashboard.tsx`
4. Create `src/components/admin/OrgTreeBuilder.tsx`
5. Create `src/components/admin/UserManagementTable.tsx`
6. Create `src/components/admin/RateCardEditor.tsx`
7. Create `src/components/admin/BlockchainConfig.tsx`
8. Create `src/components/admin/AuditLogViewer.tsx`
9. Update `src/app/(app)/dashboard/page.tsx` to render AdminDashboard when role='admin'
10. Test: Can admin create dept? Edit user? Create rate card? View audit logs?

### Phase 3: Faculty Dashboard
1. Copy `MASTER_ARCHITECTURE_GUIDE.md` Section 1.4 (Faculty role)
2. Create `src/lib/db/queries/faculty.ts`
3. Create `src/components/faculty/FacultyDashboard.tsx`
4. Create each component: ProgressRing, ActionButton, TodaySchedule, etc.
5. Test: Faculty can mark attendance? Nominate for tasks? Submit proofs?

### Phase 4-6: HOD, Director, Finance
Repeat same pattern for each role.

---

## Testing Checklist

Before marking any dashboard complete:
- [ ] Sidebar shows correct role menu
- [ ] Dashboard loads without errors
- [ ] All DB queries execute successfully
- [ ] Real data from Supabase appears (not mock data)
- [ ] Try switching roles (logout + login as different role)
- [ ] Every button/form works and creates audit_log entry
- [ ] Error states show properly (API down, permission denied, etc.)
- [ ] Loading states show for 1-2 seconds minimum
- [ ] Empty states render when no data
- [ ] Mobile responsive (test on small screen)
- [ ] No hardcoded colors (all use CSS variables)
- [ ] Timestamps in correct timezone

---

## What NOT To Do

- DO NOT invent UI/components - everything is specified in MASTER_ARCHITECTURE_GUIDE.md
- DO NOT hardcode data - all dashboards must query Supabase
- DO NOT skip audit logging - every action must log
- DO NOT create multiple sidebars - one component, role-based content
- DO NOT filter at component level - filter at query level
- DO NOT use mock data - use real DB queries
- DO NOT forget three-state pattern (loading/error/success)
- DO NOT hardcode colors
- DO NOT allow role-mixing (one user = one role at a time)

---

## Emergency Reference

**Sidebar is broken?** → Check `src/components/layout/AppSidebar.tsx` and useRole hook
**Dashboard doesn't load?** → Check dashboard page routing in `src/app/(app)/dashboard/page.tsx`
**Data not showing?** → Check query file in `src/lib/db/queries/*.ts` - is it filtering by correct user/dept?
**Permission error?** → Check if component is wrapped in `<RoleGate>` with correct permission
**Colors look wrong?** → Ensure using CSS variable names, not hex codes
**Audit log missing?** → Check if API route creates audit_logs entry after action

---

## Key URLs

- Local: `http://localhost:3000/login`
- Signup: `http://localhost:3000/signup`
- Admin: `http://localhost:3000/dashboard` (when logged in as admin role)
- Faculty: `http://localhost:3000/dashboard` (when logged in as faculty role)

---

## You Are Ready To Build

This prompt contains everything needed. All requirements are in the referenced files. NO hallucination needed - just follow the spec.

**Start by reading MASTER_ARCHITECTURE_GUIDE.md completely, then build Phase 2 (Admin Dashboard).**

