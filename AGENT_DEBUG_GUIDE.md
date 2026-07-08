# Agent Debug & Implementation Guide

## THE PROBLEM YOUR AGENT FACED

```
Error: Could not find the table 'public.task_nominations'
```

### Root Cause (3 issues):

1. **Wrong Table Name**
   - Code used: `task_nominations` 
   - Actual schema: `nominations`
   - This was copy-paste from old design docs

2. **Wrong Column Name**
   - Code used: `faculty_id`
   - Actual schema: `user_id` (because users can be admin/HOD too)

3. **Missing Role-Based Filters**
   - Code didn't check WHO is asking
   - Faculty should only see their own tasks
   - HOD should only see department tasks
   - Admin should see all tasks

---

## WHAT I FIXED

### Step 1: Corrected `getAssignedTasks()` in `tasks.ts`
```
FROM:  .from('task_nominations')  ❌
TO:    .from('nominations')       ✅

FROM:  .eq('faculty_id', userId)  ❌
TO:    .eq('user_id', userId)     ✅
```

### Step 2: Added Role-Based Query Functions
Each page now has a dedicated query function that handles role-based filtering:

```
getOpenPoolTasksForFaculty()       → Faculty sees open tasks + skill-matched
getNominationsForTask()            → Manager sees who nominated
getTasksToApprove()                → HOD sees tasks needing approval
getDepartmentTasks()               → HOD Dashboard sees department overview
```

---

## HOW THE DATA FLOW WORKS

### For Faculty User (My Work page):

```
1. Faculty logged in → Get user.id
2. Call getAssignedTasks(user.id)
3. Query nominations table WHERE user_id = user.id AND status = 'ACCEPTED'
4. Join with unstructured_tasks to get full task details
5. Show faculty: Tasks I accepted, with deadline/progress
6. Faculty CAN: Mark complete, submit proof
7. Faculty CANNOT: Edit task, change deadline, approve others
```

### For Manager/HOD (Task Pool / Approvals):

```
1. HOD logged in → Get user.id + department_id
2. Call getTasksToApprove(user.id, departmentId)
3. Query unstructured_tasks WHERE department_id = HOD's dept AND status = 'IN_PROGRESS'
4. Show HOD: Tasks from faculty needing approval
5. HOD CAN: Approve, reject, reassign
6. HOD CANNOT: Create new tasks (only Director can via MINT)
```

### For Director/Admin (Finance/Dashboard):

```
1. Director logged in → Get user.id + role
2. Call getDepartmentTasks(departmentId) for each dept
3. Query with NO department filter (see all)
4. Show Director: System-wide metrics, token flow, overrides
5. Director CAN: Mint tokens, override approvals, reverse transfers
6. Director CANNOT: Do faculty's work (must use proper channels)
```

---

## TABLE REFERENCE

### Core Tables Your Queries Use:

| Table | Purpose | Key Columns | Used By |
|-------|---------|---|---|
| `users` | All people | id, name, email, role, department_id, progress_percentage | Everyone |
| `unstructured_tasks` | Open pool work | id, title, token_points, status, creator_id, assigned_to_id, department_id | All pages |
| `nominations` | Interest in tasks | id, task_id, user_id, status | Task Pool, Approvals |
| `structured_tasks` | Class/lab work | id, user_id, date, time_slot, status, credits_earned | Faculty only |
| `roles` + `user_roles` | Permission system | role_id, user_id, scope, action | RoleGate wrapper |
| `audit_logs` | Compliance trail | actor_id, action, entity_type, state_before, state_after | Admin/Compliance |

### Status Enums:

```sql
-- unstructured_tasks.status
'OPEN'        → Available in pool (no one assigned yet)
'NOMINATED'   → Faculty expressed interest (nominations exist)
'ASSIGNED'    → Manager picked someone (assigned_to_id set)
'IN_PROGRESS' → Faculty accepted and is working
'COMPLETED'   → Faculty submitted proof
'VERIFIED'    → Approved and tokens minted
'REJECTED'    → Rejected by approver

-- nominations.status
'PENDING'  → Faculty said "I want this" → Manager reviewing
'ACCEPTED' → Manager said "yes, do this" → Faculty can work
'REJECTED' → Manager said "no" → Task open to others
```

---

## PAGE-BY-PAGE QUERY MAPPING

### 1. `/login` & `/signup`
- No queries needed (auth only)
- After login: Redirect to dashboard

### 2. `/dashboard` (Role-specific view)
**Faculty sees:**
- My Work: 3 pending tasks, 5 completed this month
- Salary: Progress ring, "Initiate Salary" button (if ≥85%)

**Query:**
```ts
getAssignedTasks(userId)  // My accepted work
getSalaryStatus(userId)   // Token balance + progress
```

**HOD sees:**
- Department: 12 tasks pending approval, 5 overdue
- Team: 15 faculty, utilization %, fairness index

**Query:**
```ts
getTasksToApprove(userId, departmentId)
getDepartmentTasks(departmentId)
getUsersByDepartment(departmentId)
```

**Director sees:**
- System: Total tokens, circulation velocity, loan defaults
- Departments: Salary initiation requests, pending approvals

**Query:**
```ts
getOrganizationMetrics(orgId)  // All tokens, all depts
getPendingSalaryRequests(orgId)
```

---

### 3. `/my-work` (Faculty ONLY)
**Shows:** My assigned tasks (status ACCEPTED)

**Query:**
```ts
getAssignedTasks(userId)  // ✅ Already fixed
```

**Actions by role:**
- Faculty: View, mark complete, submit proof ✅
- HOD: Cannot see (not their task) ❌
- Admin: Can see audit trail ✅

---

### 4. `/task-pool` (Faculty + Manager)
**Faculty sees:** Open tasks + matching skills

**Query:**
```ts
getOpenPoolTasksForFaculty(userId, departmentId, userSkills)
// + check: Have I already nominated?
```

**Manager/HOD sees:** All tasks in dept with nomination count

**Query:**
```ts
getDepartmentTasks(departmentId)
getNominationsForTask(taskId)  // For each task
```

---

### 5. `/approvals` (HOD/Director ONLY)
**Shows:** Pending nominations and completed work needing approval

**Query:**
```ts
getNominationsForTask(taskId)     // Who wants which task?
getTasksToApprove(userId, deptId) // Work submitted for approval
```

---

### 6. `/team` (HOD + Admin)
**HOD sees:** Their department members + progress

**Query:**
```ts
getUsersByDepartment(departmentId)
getProgressRing(userId)  // For each user
```

---

### 7. `/finance` (Director + Finance)
**Shows:** Token transactions, loans, balances

**Query:**
```ts
getTokenTransactions(orgId)
getLoans(orgId)
getBalancesByDept(orgId)
```

---

### 8. `/settings` (All roles - self only)
**Shows:** User preferences, notifications, integrations

**Query:**
```ts
getUserProfile(userId)  // Self only
getNotifications(userId)
```

---

### 9. `/profile` (All roles)
**Shows:** User profile + activity history

**Query:**
```ts
getUserProfile(userId)
getAuditLogs(entity_type='user', entity_id=userId)  // Self + admin
```

---

## THE GOLDEN RULE: USE ROLE CHECKS

**WRONG WAY (What agent was doing):**
```tsx
// BAD: Anyone can see this if they guess the URL
const tasks = await getAssignedTasks(userId);
export default function MyWorkPage() {
  return <MyWorkClient tasks={tasks} />;
}
```

**RIGHT WAY:**
```tsx
// GOOD: Wrapped in RoleGate
<RoleGate requiredRole={['faculty']}>
  <MyWorkPage />
</RoleGate>

// GOOD: Query already filters by user
const tasks = await getAssignedTasks(userId);
// If HOD tries to pass someone else's userId, query won't return (doesn't belong to them)
```

---

## HOW TO BUILD PAGES NOW

For each page:

1. **Identify the role** → Who should see this?
2. **Write role-based query** → Already in `tasks.ts`
3. **Wrap page in RoleGate** → In route group layout
4. **Use CSS variables** → From One UI design system
5. **Implement three-state** → Loading → Error → Success
6. **Never hardcode role checks** → RoleGate handles it

---

## DEBUGGING CHECKLIST

When a query fails:

```
1. ❓ Wrong table name?
   grep the schema for exact table name

2. ❓ Wrong column name?
   SELECT * FROM information_schema.columns 
   WHERE table_name = 'nominations'

3. ❓ Wrong user filter?
   getAssignedTasks(userId) should filter by user_id
   
4. ❓ Role shouldn't see this?
   Add RoleGate wrapper to page

5. ❓ Status enum wrong?
   Check ENUM definitions in schema:
   - unstructured_tasks: 'OPEN', 'NOMINATED', 'ASSIGNED', etc.
   - nominations: 'PENDING', 'ACCEPTED', 'REJECTED'
```

---

## NEXT STEPS FOR YOUR AGENT

1. **Read** `PAGE_STRUCTURE_COMPLETE.md` → Know what each page does
2. **Read** `ONEUI_DESIGN_TOKENS.md` → Know the colors/fonts
3. **Pick ONE page** → Start with `/dashboard`
4. **Use role-based query** from `tasks.ts` → Already fixed
5. **Wrap in RoleGate** → Check layout
6. **Build component** → Use CSS variables
7. **Apply three-state** → Loading, error, success
8. **Test with different roles** → Faculty sees less, HOD/Admin sees more

---

## CURRENT STATUS

✅ Fixed: `tasks.ts` queries (table names, column names)
✅ Added: Role-based query functions
✅ Fixed: `my-work/page.tsx` server component
❌ TODO: Build all 10 pages with proper role-based views
❌ TODO: Add RoleGate to route layouts
❌ TODO: Build components with three-state pattern
❌ TODO: Add audit logging on sensitive actions

Start with fixing `/dashboard` page next.
