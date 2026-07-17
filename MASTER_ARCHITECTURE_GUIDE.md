# WorkToken Master Architecture Guide

## 1. COMPLETE ROLE HIERARCHY & PERMISSIONS

### Roles & Access Control

The system has 5 core roles, each with distinct sidebar menus and dashboard views:

#### 1.1 ADMIN (System Administrator)
**Purpose**: Configure platform, manage users, maintain system health.

**Sidebar Menu**:
- Dashboard (admin view)
- Settings (organization setup)
- Audit Log (view all actions)

**Key Permissions**:
- users.manage (create, edit, deactivate, bulk import users)
- organizations.configure (edit org details, manage hierarchy, departments)
- rate_cards.manage (create/edit token rates by task type)
- blockchain.configure (set contract address, RPC endpoint)
- audit.view (view all audit logs - immutable trail)
- billing.manage (subscription plan, usage metrics)

**Database Tables Used**:
- users (full CRUD)
- departments (create/update)
- organizations (read/update)
- rate_cards (create/update/delete)
- audit_logs (read only)
- roles & permissions (read only - for reference)

**Admin Dashboard Components**:
1. **OrgTreeBuilder** - Drag-and-drop hierarchy editor
   - Shows org → departments → HODs
   - Can create, rename, delete departments
   - Assigns HODs to departments
   - Logs all changes to audit_logs

2. **UserManagementTable** - User admin panel
   - List all users with filters (name, email, role, dept, status)
   - Bulk CSV import with validation
   - Edit user: name, department, role
   - Deactivate/activate users
   - Search by email or employee_id

3. **RateCardEditor** - Token economy configuration
   - Displays rate_cards: task_type, tokens_per_hour, role_multipliers
   - Create new rate card (effective_date, is_active)
   - Edit multipliers for each role
   - Version history (track changes over time)

4. **BlockchainConfig** - Smart contract setup
   - Input fields: contract_address, rpc_endpoint
   - Test connection button (validates blockchain connectivity)
   - Shows current contract ABI if loaded

5. **AuditLogViewer** - Complete action trail
   - Shows all audit_logs: who, what, when, before/after state
   - Filterable by: date range, actor, entity_type, action
   - Export to CSV
   - Full immutability - no edit/delete allowed

#### 1.2 DIRECTOR (Institutional Leader)
**Purpose**: Monitor org-wide performance, token economy, high-level loan decisions.

**Sidebar Menu**:
- Dashboard (director view - org-wide KPIs)
- (No other menu items - limited scope)

**Key Permissions**:
- dashboard.view_org (see cross-department KPIs, heatmaps)
- tokens.mint (initiate minting or view minting status)
- loans.approve (approve/reject work-loan requests)
- reports.view_all (access org-wide analytics)
- organizations.configure (optional - edit org hierarchy)
- audit.view (view audit logs)

**Director Dashboard Components**:
1. **KPI Cards** - org-wide metrics
   - Total Minted (sum of token_transactions where type='MINT')
   - Faculty-held Tokens (sum of users.token_balance)
   - Tokens Reversed This Month (sum of REVERSE_TRANSFER txns this month)
   - Faculty Below Threshold (count of users where token_balance < loan_threshold)

2. **Token Flow Donut Chart**
   - Shows breakdown of token_transactions by type for current month
   - MINT, SALARY_TRANSFER, REVERSE_TRANSFER, LOAN_ISSUE

3. **Department Completion Heatmap**
   - Grid of departments × metrics
   - Metrics: task completion %, avg token earned, avg utilization
   - Color coded: green=good, yellow=warning, red=alert
   - Drill-down: click dept to see detailed team view

4. **Active Loans Table**
   - Lists loans where status='ACTIVE'
   - Shows: faculty name, amount, age (days since created), Flag button
   - Flag button: creates notification for HR/compliance review

5. **Pending Loan Approvals** (tabbed section)
   - Lists loans where status='PENDING'
   - Approve button: updates status to ACTIVE, creates audit log
   - Reject button: updates status to REJECTED, sends notification

#### 1.3 HOD (Head of Department)
**Purpose**: Manage department, approve tasks, oversee team performance.

**Sidebar Menu**:
- Dashboard (HOD personal + dept view)
- My Work (HOD's personal tasks - if any)
- Task Pool (dept tasks with management controls)
- Approvals (department approvals needed)
- Team (department members with heatmap)
- Settings (department settings only)

**Key Permissions (as manager)**:
- tasks.create (post unstructured tasks to dept pool)
- tasks.assign (allocate tasks from pool to faculty)
- tasks.verify (verify completion proof for tasks)
- approvals.approve_attendance (batch approve weekly attendance)
- approvals.approve_salary (sign off on salary token transfers)
- team.view (see dept members' progress, token balances)
- team.flag (flag underperformers for HR)
- reports.view_dept (department-level reports)

**Key Permissions (as employee)**:
- profile.view_own (own progress, tokens)
- tasks.submit_attendance (mark own attendance)
- tasks.nominate (self-nominate for open tasks)
- tasks.complete (submit proof for assigned tasks)
- salary.initiate (request salary transfer when threshold met)
- loans.request (apply for work loan)

**HOD Dashboard Components**:

*Top Section (Own Progress - if HOD is also faculty)*:
1. ProgressRing - token progress %
2. ActionButton - Initiate Salary or Request Loan
3. TodaySchedule - structured tasks for today
4. ActionButton (alternate) - submit attendance

*Bottom Section (Manager Tabs)*:

**Approvals Tab**:
1. AttendanceApprovalTable
   - Lists structured_tasks where status='PENDING_APPROVAL' for HOD's dept
   - Columns: faculty name, class, date, present, absent, submit date
   - Grouped by week (week_start to week_end)
   - "Approve All" button: updates all to status='APPROVED', logs action
   - Checkbox selection for partial approval

2. SalaryTransferApprovals
   - Lists token_transactions where type='SALARY_TRANSFER', status='PENDING'
   - For HOD's department faculty only
   - Columns: faculty name, requested amount, current balance, progress %
   - "Approve" button: updates status to 'CONFIRMED', triggers blockchain (if enabled)
   - Logs HOD's digital signature (off-chain) in audit_logs

**Task Pool Tab**:
- Same Kanban board as /task-pool but filtered to HOD's department
- Columns: OPEN → NOMINATED → ASSIGNED → IN_PROGRESS → COMPLETED → VERIFIED
- HOD can:
  - Create task button: opens modal, adds to dept_id pool
  - Assign button: selects nominee, moves to ASSIGNED
  - View nominations: see who nominated, their skills, progress %
  - Verify completion: check proof file, click Verify to update status

**Team Tab**:
1. TeamHeatmap - grid of member cards
   - Each card: name, avatar, progress %, token balance, loan status
   - Color coded: green=on-track, yellow=at-risk, red=below-threshold
   - Click card: opens detailed member view

2. Detailed Member View (modal/drawer)
   - Work history: structured tasks completed this semester
   - Token transactions: all transfers to/from this faculty
   - Attendance: weekly attendance summary
   - Loans: active loans, repayment progress
   - "Assign Task" button: pre-fills member in task creation

**Important**: HOD's own salary approval must be signed by Director (not self-approved).

#### 1.4 FACULTY (Teaching Staff)
**Purpose**: Core workload management, self-nomination, personal token tracking.

**Sidebar Menu**:
- Dashboard (faculty view - personal progress)
- My Work (view personal tasks + mark attendance)
- Task Pool (view open tasks, nominate self)
- (No Approvals, Team, Finance, Audit for faculty)

**Key Permissions**:
- profile.view_own (view own progress, token balance, loan status)
- tasks.view_own (see personal structured + assigned unstructured tasks)
- tasks.submit_attendance (mark attendance for own classes)
- tasks.nominate (self-nominate for open unstructured tasks)
- tasks.complete (submit proof for assigned tasks)
- salary.initiate (request salary transfer when threshold met)
- loans.request (apply for work loan)

**Faculty Dashboard Components**:
1. **ProgressRing**
   - Circular progress indicator
   - Shows: current token_balance / threshold (e.g., 450 / 500 tokens)
   - Color: green if above threshold, red if below
   - Click opens: token history chart

2. **ActionButton** (context-aware)
   - If above threshold: "Initiate Salary Transfer" button
     - Click: opens SalaryTransferModal
     - User confirms amount, system creates token_transaction (SALARY_TRANSFER, PENDING)
   - If below threshold: "Request Work Loan" button
     - Click: opens LoanRequestModal
     - User enters amount, reason, system creates loan (PENDING)
     - Notification sent to Director for approval

3. **TodaySchedule**
   - Shows structured_tasks for today (filtered by user_id, date=today)
   - Columns: task type, time, location
   - For each task: "Mark Attendance" button if status='UPCOMING'
     - Click: opens AttendanceModal (present/absent radio, notes)
     - Submits to structured_tasks, updates status

4. **ActiveCommitments**
   - Shows unstructured_tasks where assigned_to_id=user_id, status != 'COMPLETED'
   - Cards: title, description, deadline, priority, assigned_by
   - "View Details" → opens task details with:
     - Full description, required skills, deadline, nominated date, assigned date
     - "Submit Proof" button: opens file upload dialog
     - Proof file submitted → creates task_proofs record
     - HOD reviews and clicks "Verify" to update task status to 'VERIFIED'
     - Token reward automatically calculated and added to user.token_balance

5. **TokenBalanceWidget**
   - Shows: "You have X tokens" (user.token_balance)
   - Mini transaction history: last 3 transfers (in/out)
   - Click to expand: full transaction history page

6. **LoanAlert**
   - If user.loan_balance > 0:
     - "Active Loan: X tokens remaining"
     - Repayment schedule: when loan amount is deducted
   - If no loan: "No active loans"

**Faculty My Work Page**:
- Weekly calendar view with all structured_tasks
- For each task: ability to mark attendance
- Section: "My Unstructured Tasks"
  - All unstructured_tasks where assigned_to_id=user_id
  - Status breakdown: IN_PROGRESS, COMPLETED, VERIFIED
  - For IN_PROGRESS: "Submit Proof" button

**Faculty Task Pool Page**:
- Kanban board view (read-only for most columns)
- OPEN column: shows all tasks in dept, "Nominate Myself" button
  - Click: creates nominations record (status=PENDING)
  - Notification sent to HOD
- NOMINATED column: tasks where user_id nominated, status='NOMINATED'
  - Shows: "Awaiting HOD review"
- ASSIGNED column: tasks where user_id assigned, status='ASSIGNED'
  - Shows: "You are assigned to this task"
  - "Submit Proof" button available
- COMPLETED column: tasks user_id completed, status='VERIFIED'
  - Shows: token reward earned

#### 1.5 FINANCE (Finance Department Head)
**Purpose**: Final salary release, token circulation verification, batch reversal.

**Sidebar Menu**:
- Dashboard (finance view - token KPIs)
- Finance (transaction management)
- Approvals (salary reversals)
- Audit Log (financial transactions only)

**Key Permissions**:
- finance.view (see all token balances, transaction history)
- finance.reverse_transfer (initiate batch reverse transfer on salary day)
- audit.view (access audit logs for financial transactions)

**Finance Dashboard Components**:
1. **KPI Cards**
   - Total Minted: sum of token_transactions where type='MINT'
   - Tokens Held by Faculty: sum of users.token_balance
   - Tokens Ready for Reversal: sum of token_transactions where type='SALARY_TRANSFER', status='CONFIRMED' (not yet reversed)
   - Transaction Volume (this month): count of all txns

2. **Director Wallet Balance**
   - Shows director's token_balance
   - After reversal: director wallet should equal total minted

3. **"Trigger Batch Reverse Transfer" Button**
   - Click: system loops through all faculty with positive token_balance
   - For each faculty: creates token_transaction (type='REVERSE_TRANSFER', from_user_id=faculty.id, to_user_id=director.id)
   - Updates users.token_balance (faculty balance decremented, director balance incremented)
   - Creates audit_logs entry for each transaction
   - Email notification to Finance: "Batch reversal processed: X tokens transferred"

4. **Transaction Log**
   - Table: all token_transactions
   - Filterable by: date range, transaction type (MINT, SALARY_TRANSFER, REVERSE_TRANSFER, LOAN_ISSUE)
   - Sortable by: date, amount
   - "Export Report" button: generates CSV/PDF of all salary transfers + reversals for payroll

5. **Salary Transfer Summary** (optional)
   - Shows this month's salary transfers by department
   - Columns: department name, total transferred, faculty count, pending approvals
   - Status indicators: all approved = green, pending = yellow

---

## 2. DATABASE SCHEMA MAPPING

All code queries must use the schema exactly as defined in the SQL file. Key tables:

```sql
-- Users & Org
organizations (id, name, type, logo_url, created_at)
departments (id, organization_id, name, hod_id, created_at)
users (id, organization_id, department_id, email, name, role, token_balance, loan_balance, progress_percentage, wallet_address, created_at)

-- Tasks
structured_tasks (id, user_id, task_type, subject, date, time_slot, attendance_present, attendance_absent, status, credits_earned, approved_by, created_at)
unstructured_tasks (id, organization_id, department_id, title, description, token_points, creator_id, assigned_to_id, required_skills, deadline, priority, status, created_at)
nominations (id, task_id, user_id, message, status, created_at)
task_proofs (id, task_id, user_id, file_url, description, submitted_at, verified, verified_by)

-- Financial
token_transactions (id, organization_id, from_user_id, to_user_id, amount, type, status, timestamp)
loans (id, organization_id, user_id, amount, remaining, status, approved_by, created_at, cleared_at)
attendance_batches (id, organization_id, hod_id, department_id, week_start, week_end, status, created_at)

-- Config
rate_cards (id, organization_id, task_type, tokens_per_hour, role_multipliers, effective_date, is_active)
roles (id, organization_id, name, is_system_role, created_at)
permissions (id, scope, action, description)
role_permissions (role_id, permission_id)
user_roles (user_id, role_id)

-- Audit
audit_logs (id, organization_id, actor_id, action, entity_type, entity_id, state_before, state_after, timestamp)
```

---

## 3. COMPONENT STRUCTURE

All components are organized by role and function. No component displays data for unauthorized roles.

### Admin Components (`src/components/admin/`)
- `OrgTreeBuilder.tsx` - Org hierarchy editor
- `UserManagementTable.tsx` - User CRUD
- `RateCardEditor.tsx` - Token economy config
- `BlockchainConfig.tsx` - Blockchain setup
- `AuditLogViewer.tsx` - Action audit trail

### Director Components (`src/components/director/`)
- `KPICards.tsx` - Org metrics
- `TokenFlowChart.tsx` - Token movement visualization
- `DepartmentHeatmap.tsx` - Dept performance grid
- `LoansTable.tsx` - Active loans list
- `LoanApprovalPanel.tsx` - Pending loan approvals

### HOD Components (`src/components/hod/`)
- `HodProgressSection.tsx` - Personal progress (if faculty)
- `AttendanceApprovalTable.tsx` - Weekly attendance approvals
- `SalaryApprovalPanel.tsx` - Salary transfer approvals
- `TaskPoolKanban.tsx` - Department task management
- `TeamHeatmap.tsx` - Dept member cards

### Faculty Components (`src/components/faculty/`)
- `ProgressRing.tsx` - Token progress indicator
- `ActionButton.tsx` - Salary/Loan context button
- `TodaySchedule.tsx` - Today's classes
- `ActiveCommitments.tsx` - Assigned tasks
- `TokenBalanceWidget.tsx` - Token balance display
- `LoanAlert.tsx` - Loan status alert

### Shared Components (`src/components/shared/`)
- `RoleGate.tsx` - Permission wrapper
- `LoadingState.tsx` - Loading skeleton
- `ErrorState.tsx` - Error boundary
- `EmptyState.tsx` - Empty data display

---

## 4. QUERY LAYER (`src/lib/db/queries/`)

Each role has dedicated query files that enforce role-based filtering:

### `admin.ts`
- `getOrgStructure()` - Full org tree
- `getAllUsers(orgId)` - All users with filters
- `createUser(data)` - User creation
- `updateUser(userId, data)` - User updates
- `getRateCards(orgId)` - All rate cards
- `createRateCard(data)` - New rate card
- `getAuditLogs(filters)` - All audit logs (immutable)

### `director.ts`
- `getOrgKPIs(orgId)` - Dashboard metrics
- `getTokenTransactions(orgId, monthRange)` - Token flow
- `getDepartmentMetrics(orgId)` - Dept performance
- `getActiveLoan(orgId)` - Active loans list
- `getPendingLoans(orgId)` - Pending approvals
- `approveLoan(loanId, directorId)` - Approve loan (creates audit log)
- `rejectLoan(loanId, directorId)` - Reject loan

### `hod.ts`
- `getHodProfile(userId)` - HOD's own data
- `getDepartmentTeam(deptId)` - All dept members
- `getAttendanceForApproval(deptId, weekStart, weekEnd)` - Weekly attendance
- `approveAttendance(attendanceBatchId, hodId)` - Batch approve
- `getSalaryTransfersForApproval(deptId)` - Pending salary approvals
- `approveSalaryTransfer(txnId, hodId)` - Approve salary (creates audit log)
- `getDepartmentTasks(deptId)` - All dept tasks
- `createTask(deptId, creatorId, taskData)` - Post task
- `assignTask(taskId, facultyId)` - Allocate task
- `verifyTaskCompletion(taskId, hodId)` - Verify proof

### `faculty.ts`
- `getFacultyProfile(userId)` - Personal progress
- `getStructuredTasks(userId, dateRange)` - Classes
- `getUnstructuredTasks(userId)` - Assigned tasks
- `submitAttendance(taskId, userId, present, absent)` - Mark attendance
- `getOpenTasks(deptId, userSkills)` - Task pool (skill filtered)
- `nominateForTask(taskId, userId, message)` - Self-nominate
- `submitTaskProof(taskId, userId, fileUrl)` - Submit proof
- `initiateSalaryTransfer(userId, amount)` - Request salary
- `requestLoan(userId, amount, reason)` - Request loan

### `finance.ts`
- `getFinanceKPIs(orgId)` - Finance dashboard metrics
- `getTokenTransactionHistory(orgId, filters)` - Transaction log
- `triggerBatchReverseTransfer(orgId, financeUserId)` - Batch reversal (creates multiple audit logs)
- `exportSalaryReport(orgId, monthRange)` - CSV/PDF export

---

## 5. API ROUTES (`src/app/api/`)

All routes verify permission before executing action:

```
POST /api/admin/users - Create user (requires users.manage)
PUT /api/admin/users/[id] - Update user (requires users.manage)
POST /api/admin/org - Update org (requires organizations.configure)
POST /api/hod/tasks - Create task (requires tasks.create)
POST /api/hod/tasks/[id]/assign - Assign task (requires tasks.assign)
POST /api/hod/approvals/attendance - Approve attendance (requires approvals.approve_attendance)
POST /api/hod/approvals/salary - Approve salary (requires approvals.approve_salary)
POST /api/faculty/attendance - Submit attendance (requires tasks.submit_attendance)
POST /api/faculty/nominate - Self-nominate for task (requires tasks.nominate)
POST /api/faculty/salary - Initiate salary transfer (requires salary.initiate)
POST /api/finance/reverse-transfer - Batch reverse (requires finance.reverse_transfer)
GET /api/audit/logs - View audit logs (requires audit.view)
```

All POST/PUT endpoints:
1. Verify user JWT
2. Check permission via `check_user_permission()` function
3. Execute query with role-based filters
4. Log action to audit_logs
5. Return result or error

---

## 6. MIDDLEWARE & AUTH (`src/middleware.ts`)

1. Intercept all requests to /app routes
2. Verify Supabase session (JWT)
3. Fetch user role from DB
4. Allow/deny based on route + role
5. Redirect unauthorized users to /login

---

## 7. IMPLEMENTATION PRIORITY

**Phase 1: Core (DONE)**
- Sidebar role-based menus ✓
- useRole hook fixed ✓
- Dashboard routing by role ✓

**Phase 2: Admin Dashboard (DO NEXT)**
- Build AdminDashboard.tsx with all 5 components
- Implement admin query layer (admin.ts)
- Test org tree creation, user CRUD, rate card updates

**Phase 3: Faculty Dashboard (DO NEXT)**
- Build FacultyDashboard.tsx with all 6 components
- Implement faculty query layer (faculty.ts)
- Test attendance marking, task nomination, proof submission

**Phase 4: HOD Dashboard**
- Build HodDashboard.tsx with approval + team tabs
- Implement hod query layer (hod.ts)
- Test attendance/salary approvals, task assignment

**Phase 5: Director Dashboard**
- Build DirectorDashboard.tsx with KPIs + heatmap
- Implement director query layer (director.ts)
- Test loan approvals, org metrics

**Phase 6: Finance Dashboard**
- Build FinanceDashboard.tsx
- Implement finance query layer (finance.ts)
- Test batch reversal, transaction export

**Phase 7: API Routes & Testing**
- All API endpoints with permission checks
- Full permission matrix testing
- Audit log verification

---

## 8. ERROR HANDLING & STATES

Every page follows three-state pattern:
- **Loading**: Show skeleton, no data
- **Error**: Show error message with retry button
- **Success**: Render data with interactions

Every component must handle:
- No data (empty state)
- API failures (error state with message)
- Permission denied (403 message)
- Unauthorized (redirect to login)

---

## 9. AUDIT & IMMUTABILITY

All actions that modify data must:
1. Create audit_logs entry (before + after state)
2. Include actor_id (who performed action)
3. Include timestamp
4. Immutable: never modify or delete audit_logs

Example:
```sql
INSERT INTO audit_logs (organization_id, actor_id, action, entity_type, entity_id, state_before, state_after, timestamp)
VALUES (
  org_id,
  admin_id,
  'user_deactivated',
  'users',
  user_id,
  jsonb_build_object('status', 'active'),
  jsonb_build_object('status', 'inactive'),
  NOW()
);
```

---

## 10. TESTING CHECKLIST

Before marking dashboard complete:
- [x] Sidebar shows correct menu items for role
- [x] Dashboard loads without errors
- [x] All DB queries execute successfully
- [x] Try switching between different roles (logout + login)
- [x] Verify all components render with real data
- [x] Test each interactive button/form
- [x] Check audit_logs for all actions
- [x] Verify error states (API down, permission denied, etc.)
- [x] Mobile responsive design verified
- [x] No hardcoded colors (use CSS variables)
- [x] All timestamps in correct timezone

