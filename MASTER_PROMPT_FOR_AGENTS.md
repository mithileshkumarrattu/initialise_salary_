# MASTER PROMPT FOR ALL AGENTS - WorkToken Platform

> **CRITICAL**: Read this FIRST before any other file. This is your source of truth.

---

## CRITICAL: Why Previous Agent Hallucinated

The old agent failed because:

1. **Didn't understand the actual problem** - It wasn't about payment systems, it was about making **invisible work visible** through **immutable token accounting**
2. **Didn't read implementation_plan.md fully** - It created random pages without understanding the organizational hierarchy
3. **Created mock data everywhere** - Violated the golden rule: ZERO mock data
4. **Didn't understand role-based architecture** - Created separate routes for each role instead of single `/dashboard` with role detection
5. **Confused itself with multiple approaches** - Started with blockchain, then gave up, then tried again
6. **Didn't establish design system first** - Started building components before tokens were defined

**What changed**: I established **absolute ground truth** - this document. No exceptions. No creativity. No interpretation.

---

## THE ABSOLUTE GROUND TRUTH

### What We're Building

A **token-based work accounting system** for educational institutions (primarily colleges) that:

1. **Makes all work visible** - Teaching classes, organizing tasks, mentoring are all tracked
2. **Ties compensation to verified output** - Salary released only when faculty reaches 85% progress threshold
3. **Uses blockchain for immutability** - Every token transfer is permanently recorded
4. **Has role-based workflows** - Director mints tokens → HOD approves work → Faculty proves completion → Finance releases salary

### The Core Loop

```
DIRECTOR
  └─ Mints total salary budget as tokens
  
HOD (for each department)
  ├─ Posts unstructured tasks (events, mentoring, curriculum)
  ├─ Approves faculty structured work (class attendance)
  └─ Approves task completions
  
FACULTY
  ├─ Teaches scheduled classes (tracked automatically)
  ├─ Nominates for unstructured tasks
  ├─ Proves completion of tasks
  └─ Initiates salary transfer when progress >= 85%
  
FINANCE
  ├─ Reviews all token balances
  ├─ Approves final salary release
  └─ Triggers smart contract to transfer tokens
```

### Three-State Architecture (MUST FOLLOW)

Every component that fetches data has exactly three states:

```
1. LOADING   → Show LoadingSkeleton
2. ERROR     → Show ErrorFallback with retry
3. SUCCESS   → Show data from database OR EmptyState if no data

NEVER show default UI. NEVER mix states. NEVER use mock data as fallback.
```

### Query Layer Centralization (MUST FOLLOW)

```
❌ WRONG: const {data} = await supabase.from('tasks').select('*')
✅ RIGHT: const tasks = await getUnstructuredTasks()

Rule: ALL database access through lib/db/queries/ functions ONLY.
```

### Permission-First Design (MUST FOLLOW)

```
❌ WRONG: if (user.role === 'HOD') { <ApprovalPanel /> }
✅ RIGHT: <RoleGate requiredPermission="APPROVE_TASKS"><ApprovalPanel /></RoleGate>

Rule: Wrap restricted features in RoleGate. Never check role in JSX.
```

### Design System (MUST FOLLOW - Based on One UI)

```
Colors:
  Primary: #817AFF (purple for actions)
  Secondary: #844A87 (darker purple for alternates)
  Success: #00C853 (green for approved)
  Warning: #FFC30C (yellow for pending)
  Error: #FF3B30 (red for rejected)
  Foreground: #F2E030 (text in dark mode)
  Background: #000000 (dark background)
  Container: #1717A1A (card backgrounds)
  Light mode inverses exist (see globals.css)

Typography (Variable One UI Sans font):
  Title: 36px, 700 Bold, Sentence case
  Heading: 24px, 600 Semibold
  Subtitle: 20px, 700 Bold
  Subheading: 16px, 400 Regular
  Body: 14px, 400 Regular

Spacing: 8px base grid (p-2=8px, p-4=16px, gap-4=16px)
Radius: 12px for cards, 8px for buttons, 20px for modals (One UI style)
Blur: Dark mode blur with 60% opacity, Light mode blur with 50% opacity
```

### Golden Rules (NEVER BREAK)

1. **ZERO Mock Data** - No hardcoded arrays, seed data, or fake content
2. **Three States Always** - Loading → Error → Success for every async operation
3. **Query Layer Only** - ALL database access through lib/db/queries/
4. **RoleGate Wrapper** - Restricted features wrapped in <RoleGate>
5. **CSS Tokens Only** - hsl(var(--primary)), NEVER hardcoded colors
6. **Type Safe** - TypeScript everywhere, no `any` without reason
7. **Audit Trail** - Every transaction logged immutably

---

## THE COMPLETE PAGE MAP

### Authentication Routes (Public)

**Route**: `/auth/login`
**Purpose**: Faculty/HOD/Director/Finance login
**Components**: 
  - LoginForm (email/password input)
  - ErrorMessage (show auth errors)
**Backend**:
  - POST /api/auth/login → Verify credentials → Return JWT + user role

**Route**: `/auth/signup`
**Purpose**: New user registration (admin-only in Phase 1)
**Components**:
  - SignupForm
  - RoleSelector
**Backend**:
  - POST /api/auth/signup → Create user → Assign role

### Protected Routes (Authenticated)

**Route**: `/dashboard`
**Purpose**: Single entry point for all roles
**Role Detection Logic**:
  ```
  if (role === 'DIRECTOR') return <DirectorDashboard />
  if (role === 'HOD') return <HodDashboard />
  if (role === 'FACULTY') return <FacultyDashboard />
  if (role === 'FINANCE') return <FinanceDashboard />
  return <AccessDenied />
  ```

#### DIRECTOR Dashboard
**URL**: `/dashboard` (role=DIRECTOR)
**Purpose**: Institutional oversight, token minting, org statistics
**Components**:
  - OrgStatsCards (total tokens minted, faculty count, avg progress)
  - DepartmentProgressHeatmap (dept name, HOD, faculty count, avg %)
  - TokenMintingForm (mint new tokens, set salary budget)
  - AuditLog (all transactions, immutable)

**Data Requirements**:
  - Total tokens minted (from tokens table)
  - All departments with HOD info
  - All faculty with progress % (calculated per person)
  - All token transfers (from transactions table)

**Backend Queries**:
  - getOrgStats() → total minted, release count, avg progress
  - getAllDepartmentsWithStats() → dept name, HOD, faculty count, avg %
  - getTokenTransactionHistory() → audit trail

#### HOD Dashboard  
**URL**: `/dashboard` (role=HOD)
**Purpose**: Department management, faculty oversight, task allocation
**Components**:
  - FacultyProgressList (name, attendance %, task progress, current tokens)
  - ApprovalQueue (pending attendance batches, task completions, transfers)
  - PostTaskForm (create new unstructured task)
  - QuickStats (dept avg progress, total faculty, pending approvals)

**Data Requirements**:
  - All faculty in my department
  - Their attendance records (for this semester)
  - Their nominated tasks (pending HOD selection)
  - Pending token transfers waiting for approval

**Backend Queries**:
  - getDepartmentStats(hodId) → all faculty with stats
  - getPendingApprovals(hodId) → tasks, attendance, transfers needing approval
  - getUnstructuredTasksInDept(deptId) → open, nominated, assigned

#### FACULTY Dashboard
**URL**: `/dashboard` (role=FACULTY)
**Purpose**: Personal progress tracking, task nomination, salary initiation
**Components**:
  - ProgressRing (current progress %, target 85%)
  - TodaySchedule (classes today from timetable)
  - MyNominations (tasks I nominated for: PENDING, ASSIGNED, COMPLETED)
  - InitiateSalaryButton (if progress >= 85%)
  - TokenBalance widget

**Data Requirements**:
  - My progress % (from calculation: structured work + unstructured work)
  - My structured tasks (classes) for semester
  - My attendance record (how many I attended)
  - My nominations for unstructured tasks
  - My token balance
  - My loan balance (if any)

**Backend Queries**:
  - getCurrentUserWithProgress(userId) → all personal data
  - getStructuredTasks(userId) → my classes
  - getStructuredTaskAttendance(userId) → which I attended
  - getMyNominations(userId) → tasks I nominated for
  - getTokenBalance(userId) → my balance

#### FINANCE Dashboard
**URL**: `/dashboard` (role=FINANCE)
**Purpose**: Salary release coordination, token balance verification
**Components**:
  - AllFacultyTokenBalances (table: name, dept, balance, pending transfer)
  - PendingReleaseRequests (faculty waiting for finance approval)
  - ReleaseSalaryForm (select faculty → verify balance → trigger transfer)
  - TransactionAuditLog (all releases with blockchain tx hash)

**Data Requirements**:
  - All faculty across all departments
  - Their current token balances
  - Pending salary transfers awaiting finance approval
  - Transaction history with blockchain proof

**Backend Queries**:
  - getAllFacultyWithTokenBalance() → org-wide balances
  - getPendingFinanceApprovals() → transfers waiting for me
  - getTransactionHistory() → audit trail with tx hashes

---

### Secondary Routes (Protected)

**Route**: `/my-work`
**Purpose**: Faculty view their complete work portfolio
**Components**:
  - StructuredWorkTab (timetable, mark attendance, view approval status)
  - UnstructuredWorkTab (browse available tasks, my nominations, completed work)
  - ProgressBreakdown (structured % vs unstructured % contribution)
  - HistoricalProgressChart (progress over semester)

**Backend Queries**:
  - getStructuredTasks(userId)
  - getUnstructuredTasksNominatedBy(userId)
  - getProgressHistory(userId, semester)

**Route**: `/task-pool`
**Purpose**: Browse available unstructured tasks to nominate for
**Components**:
  - TaskFilters (by department, by token value, by deadline)
  - TaskGrid (open tasks with cards showing title, value, nominees needed)
  - NominationModal (click task → view details → nominate)
  - MyNominationsBar (showing pending, assigned, completed)

**Backend Queries**:
  - getUnstructuredTasks(filters: {status: 'OPEN', dept: X})
  - getNominationCount(taskId) → how many nominated
  - checkIfINominated(taskId, userId) → have I already nominated?

**Route**: `/team`
**Purpose**: HOD view department team members
**Components**:
  - FacultyTable (name, role, attendance %, task progress, token balance, actions)
  - BulkApprovalPanel (select multiple faculty → approve attendance batch)
  - IndividualActionMenu (approve specific person, view history, view audit)

**Backend Queries**:
  - getStaffByDepartment(deptId)
  - getPendingAttendance(deptId) → grouped by week/date
  - getIndividualAuditLog(userId)

**Route**: `/approvals`
**Purpose**: HOD/Finance review and approve pending work
**Components**:
  - TaskApprovalPanel (pending task completions: view proof → approve/reject)
  - SalaryTransferApprovalPanel (pending salary transfers: verify data → approve)
  - AttendanceApprovalPanel (pending attendance batches: review → approve)

**Backend Queries**:
  - getPendingTaskCompletions(hodId)
  - getPendingSalaryTransfers(approverRole)
  - getPendingAttendanceBatches(hodId)

---

## DUAL-TEMPLATE SYSTEM

### Template 1: College-Specific (Active in Phase 1-2)

```
Organizational Structure:
  Director (1)
    ├── Deans (1-2) [optional oversight layer]
    ├── 10 HODs (one per department)
    │   └── Faculty (20-50 per department)
    ├── Finance Department (2-3 people)
    └── Exam Cell (optional, not in scope)

Work Tracked:
  Structured: Teaching classes on timetable (credits/week)
  Unstructured: Placement drives, mentoring, curriculum redesign

Progress Formula:
  Total % = (Structured Attendance % × 0.7) + (Unstructured Tokens % × 0.3)
```

### Template 2: Generic Enterprise (Phase 3+, using same codebase)

```
Organizational Structure:
  CEO/Head (1)
    ├── Department Managers (5-10)
    │   └── Employees (10-100 per dept)
    ├── Finance/HR Department (3-5)
    └── Admin/Compliance (1-2)

Work Tracked:
  Structured: Assigned project work (hours/sprint)
  Unstructured: Mentoring, incident response, knowledge sessions

Progress Formula:
  Total % = (Project Completion % × 0.6) + (Unstructured Contribution % × 0.4)
```

### Routing to Support Both Templates

```
/college/*        → College-specific views (timetable, classes, exams)
/enterprise/*     → Enterprise views (projects, sprints, roadmaps)
/admin/templates  → Switch between templates (dev-only)

Single dashboard route detects organization type:
  if (org.type === 'COLLEGE') return <CollegeDashboard />
  if (org.type === 'ENTERPRISE') return <EnterpriseDashboard />
```

---

## STATE & COMMUNICATION DIAGRAMS

### State Diagram: Faculty Workflow

```
┌─────────────────────────────────────────────────────────┐
│ FACULTY WORKFLOW - From Login to Salary Release        │
└─────────────────────────────────────────────────────────┘

LOGIN
  ↓
DASHBOARD (see progress %)
  ↓
OPTION A: Mark Attendance (Structured Work)
  → Classes scheduled automatically
  → Faculty marks "Present" on class day
  → HOD approves attendance weekly
  → Counts toward structured work %
  ↓
OPTION B: Nominate for Tasks (Unstructured Work)
  → Browse task pool (OPEN tasks)
  → Click "Nominate" with message
  → Task status → NOMINATED
  → HOD reviews nominees
  → HOD selects 1-3 best fits
  → Task status → ASSIGNED TO FACULTY
  → Faculty submits proof (photos, documents, reports)
  → Task status → PROOF_SUBMITTED
  → HOD reviews proof
  → If approved: Task → COMPLETED, tokens awarded
  → If rejected: Task → PROOF_REJECTED, back to step 1
  ↓
PROGRESS REACHES 85%
  ↓
INITIATE SALARY TRANSFER
  → Faculty clicks "Transfer Salary"
  → System sends approval request to HOD
  ↓
HOD APPROVES (or rejects)
  ↓
SEND TO FINANCE
  → Finance views pending transfer
  → Finance approves (or rejects)
  ↓
SMART CONTRACT EXECUTES
  → Transfer tokens from Director wallet to Faculty wallet
  → Transaction recorded on blockchain
  → Tokens recorded in database
  ↓
FINANCE RELEASES FIAT SALARY
  → Based on verified tokens, release real salary to bank account
```

### Communication Diagram: Approval Workflow

```
┌──────────────────────────────────────────────────────────┐
│ SYSTEM ACTORS & MESSAGE FLOW                            │
└──────────────────────────────────────────────────────────┘

Faculty                 HOD                   Finance        Smart Contract
  │                      │                       │                  │
  │─ "Mark Attendance"──>│                       │                  │
  │                      │─ "Batch Approve"──>   │                  │
  │                      │                       │                  │
  │─ "Nominate Task"──>  │                       │                  │
  │                      │─ "Review & Approve"─> │                  │
  │                      │─ "Request Transfer"─> │                  │
  │                      │                       │─ "Verify Balance"→│
  │                      │                       │ <─ "Balance OK"   │
  │                      │                       │                  │
  │                      │                       │─ "Execute Transfer"→│
  │                      │                       │ <─ "tx_hash:..."   │
  │                      │                       │                  │
  │ <─────────────────────── "Salary Pending" ────────────────────── │
  │                      │                       │                  │
  │ <─────────────────────── "Salary Released" ──────────────────── │
```

### Class Diagram: Data Model

```
┌─────────────────────────────────────────────────────────┐
│                    USER                                  │
├─────────────────────────────────────────────────────────┤
│ id: UUID                                                │
│ email: String                                           │
│ role: Enum [DIRECTOR, HOD, FACULTY, FINANCE]           │
│ department_id: FK                                       │
│ progress_percentage: Decimal                           │
│ token_balance: Decimal                                 │
└─────────────────────────────────────────────────────────┘
              ▲          ▲          ▲
              │          │          │
       ┌──────┴──────┬──┴──────┬──┴──────┐
       │             │         │         │
┌──────┴────┐ ┌──────┴────┐ ┌─┴──────┐ ┌┴──────────┐
│ STRUCTURED│ │UNSTRUCTRED│ │ TOKENS │ │APPROVALS │
│   TASKS   │ │   TASKS   │ │        │ │          │
├───────────┤ ├───────────┤ ├────────┤ ├──────────┤
│ id        │ │ id        │ │ id     │ │ id       │
│ user_id   │ │ posted_by │ │ user_id│ │ type     │
│ subject   │ │ title     │ │amount  │ │ status   │
│ credits   │ │ value     │ │balance │ │ approver │
│ schedule  │ │ status    │ │ task_id│ │ created  │
│ dept_id   │ │ dept_id   │ │txn_id  │ │ updated  │
└───────────┘ │ deadline  │ └────────┘ └──────────┘
              │ max_noms  │
              │ proof     │
              │ hod_review│
              └───────────┘
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (COMPLETED ✓)
- [x] Architecture established
- [x] Query layer created (32 functions)
- [x] Design tokens defined
- [x] Base components built
- [x] Documentation comprehensive

### Phase 2: Role Dashboards (NEXT)
- [ ] DirectorDashboard (org stats, dept heatmap)
- [ ] HodDashboard (faculty list, approval queue)
- [ ] FacultyDashboard (progress ring, my work)
- [ ] FinanceDashboard (token balances, release form)
- [ ] API endpoints for each dashboard

### Phase 3: Task System
- [ ] TaskPool page (browse open tasks)
- [ ] TaskCard component (display task details)
- [ ] NominationForm (self-nominate)
- [ ] TaskProofForm (submit completion)
- [ ] TaskApprovalPanel (HOD reviews)

### Phase 4: Approval Workflows
- [ ] AttendanceBatchApproval
- [ ] SalaryTransferApproval
- [ ] TaskCompletionReview
- [ ] Smart contract integration
- [ ] Blockchain transaction logging

### Phase 5: Polish & Launch
- [ ] Real-time notifications
- [ ] Audit logs export
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment

---

## READING ORDER (ABSOLUTE)

**For ALL agents, new or old**:

1. **THIS FILE** (MASTER_PROMPT_FOR_AGENTS.md) - 30 minutes
2. **implementation_plan.md** - 1 hour (THE COMPLETE SPEC)
3. **DEVELOPMENT.md** - 30 minutes (PATTERNS & TEMPLATES)
4. **.context/productContext.md** - 20 minutes (WHY)
5. **.context/systemPatterns.md** - 20 minutes (HOW)

**Then start coding.**

If you deviate from these documents, you will hallucinate. If you follow them exactly, you will build correctly.

---

## CRITICAL WARNINGS

### For Old Agent (Rehabilitation)

You failed because:
1. You didn't read the full story (implementation_plan.md)
2. You created random pages without understanding why
3. You mixed mock data into components (VIOLATION OF GOLDEN RULE #1)
4. You didn't use query layer centralization
5. You guessed at architecture instead of following the spec

**Fix**: Ignore everything you "remember" about this project. Start fresh. Read this file → read implementation_plan.md → start building according to spec EXACTLY.

### For New Agents (Onboarding)

Do NOT:
- Ask "what should I build?" - It's specified here
- Create mock data - It's forbidden
- Use different patterns - Use three-state only
- Check role in components - Use RoleGate wrapper
- Hardcode colors - Use CSS tokens
- Skip reading spec - Read it all first

Do:
- Read spec first
- Follow patterns exactly
- Test with real database
- Ask clarifying questions BEFORE coding
- Verify you understand three-state pattern before starting

---

**Status**: This document is the source of truth. All other documents are implementation details of this specification.

**Last Updated**: July 8, 2026
**Version**: 1.0 (Absolute Ground Truth)
**Approved For**: All future development
