# WorkToken Platform — Comprehensive Implementation Plan

> **Last Updated**: July 8, 2026  
> **Status**: Phase 1 COMPLETE - Architecture & Foundation Ready  
> **Next Phase**: Phase 2 - Role-Based Dashboards

---

## Executive Summary: The Full Story

### The Problem We're Solving

In **educational institutions** and **large enterprises**, invisible work is everywhere:
- Faculty teach classes on a timetable → **structured work** that's verifiable but invisible
- Professors are exam cell members organizing exams → **unstructured work** that's critical but unmeasured  
- Faculty mentor students, organize events, mentor juniors → **ad-hoc work** that falls on the same proactive people every time
- Finance department verifies salaries manually → **no single source of truth**

**Result**: Management has zero real-time visibility into actual work. Salaries are paid based on contracts, not on proven output. Workload distribution is invisible. "Busy" people burn out. Managers make decisions in the dark.

### Our Solution: Token-Based Work Accounting

We're building a **tamper-proof, blockchain-backed system** that makes all work visible and ties compensation directly to verified output:

1. **Structured Work (Timetable)**: Professor teaches 3 classes per week, 2.5 months/semester = automatically tracked
2. **Unstructured Work (Available Tasks)**: HOD posts "Organize Placement Drive" (OPEN) → Faculty self-nominate → HOD approves → Faculty proves completion → **tokens earned**
3. **Progress Tracking**: Faculty sees real-time progress % toward salary threshold (e.g., 85%)
4. **Token Transfer Workflow**: Faculty reaches threshold → initiates transfer → HOD approves → Finance approves → Smart contract executes → salary released

**Key Innovation**: Salary is now **performance-backed**. Every token transfer is **immutable and auditable**.

---

## Part 1: The Organizational Hierarchy & Roles

### College/University Model (Current Implementation)

```
DIRECTOR (Institutional Level)
  ├── Owns the genesis token wallet
  ├── Mints total salary budget as tokens
  ├── Views org-wide stats & audit logs
  └── Approves high-level loan requests
      │
      ├── DEAN (Faculty Oversight - Optional)
      │   └── Views department progress
      │
      ├── HOD #1 (Department Head) ─────────┐
      │   ├── Manages 30-50 faculty       │
      │   ├── Approves attendance weekly   │
      │   ├── Approves salary transfers    │
      │   ├── Posts unstructured tasks     │
      │   └── Allocates work to faculty    │
      │       │                            │
      │       ├─ PROFESSOR                 │
      │       ├─ ASSOCIATE PROFESSOR       │
      │       ├─ ASSISTANT PROFESSOR       │
      │       ├─ LAB ASSISTANT             │
      │       └─ DEMONSTRATION STAFF       │
      │
      ├── HOD #2 (Different Department)
      └── ... (10 departments total)

FINANCE DEPARTMENT (Parallel to Departments)
  ├── Views all faculty token balances
  ├── Triggers final reverse transfer (faculty → Director)
  └── Releases real fiat salary from wallet
```

### Roles & Permissions Matrix

| Role | Structure | Approval Power | Can Post Tasks | View Finance | Attendance |
|------|-----------|---|---|---|---|
| **DIRECTOR** | Org-wide | Loan approvals, token minting | No | Yes (audit logs) | No |
| **DEAN** | Faculty oversight | None (view-only) | No | No | No |
| **HOD** | Department | Attendance, salary transfer, task completion | Yes (in dept) | Dept-level | Yes (approve batches) |
| **FACULTY** | Individual | None | Self-nominate for tasks | Own balance | Mark own attendance |
| **FINANCE** | Org-wide | Final salary release | No | Yes (all balances) | No |

---

## Part 2: Work Categories & Verification

### Structured Work (Timetable-Based)

**Definition**: Regular, recurring work on a fixed schedule  
**Examples**: Lecture (3 credits/week), Lab session, Tutorial, Practical

**Data Model**:
```
StructuredTask {
  id: UUID
  professor_id: UUID (FK → User)
  subject: String
  credits: Int (e.g., 3 = 3 classes/week)
  day: DayOfWeek
  start_time: Time
  end_time: Time
  semester: String (e.g., "2026-1")
  department_id: UUID
  
  // Attendance tracking
  scheduled_date: Date
  marked_present: Boolean
  hod_approved: Boolean
  approved_at: DateTime
}
```

**Verification Flow**:
1. HOD uploads timetable → System generates StructuredTasks
2. Each class date → attendance record created
3. Faculty marks "Present" on class day
4. HOD batch-approves attendance weekly (e.g., "Approve Mondays & Wednesdays")
5. Attendance feeds into progress % calculation

**Progress Contribution**: If faculty teaches 20 credits/week and attends 100%:
- Contribution = (Actual Attendance / Scheduled Classes) × 100%

### Unstructured Work (Ad-Hoc Tasks)

**Definition**: One-time or occasional work that's critical but not scheduled  
**Examples**: "Organize placement drive", "Mentor 5 students in Web Dev", "Prepare syllabus for new course"

**Life Cycle**:
```
1. OPEN (HOD posts)
   └─ Title: "Organize Placement Drive"
   └─ Description: "Coordinate with companies, manage interviews, report results"
   └─ Token Value: 500 tokens
   └─ Department: CSE
   └─ Deadline: July 15, 2026
   └─ Max Nominees: 3

2. NOMINATED (Faculty applies)
   └─ Faculty A: "I can do this" (self-nomination)
   └─ Faculty B: "I'm interested"
   └─ Faculty C: "Count me in"
   └─ Status: PENDING_HOD_SELECTION

3. ASSIGNED (HOD picks nominees)
   └─ Selected: Faculty A
   └─ Status: ASSIGNED_TO_FACULTY_A
   └─ Now faculty must prove completion

4. PROOF_SUBMITTED (Faculty uploads evidence)
   └─ "Placement drive completed on July 10"
   └─ Attached: Event photos, emails, attendance sheet
   └─ Status: PENDING_HOD_REVIEW

5. APPROVED (HOD validates)
   └─ Reviewed: ✓ Evidence is legitimate
   └─ Status: COMPLETED
   └─ Tokens issued: 500 → Faculty A's balance
   └─ Optional: Can mint 500 more tokens from smart contract

6. TRANSACTION RECORDED
   └─ transactions table: {from: director, to: faculty, amount: 500, task_id, tx_hash}
```

**Data Model**:
```
UnstructuredTask {
  id: UUID
  title: String
  description: Text
  department_id: UUID
  posted_by_id: UUID (FK → HOD)
  posted_at: DateTime
  status: Enum {OPEN, NOMINATED, ASSIGNED, PROOF_SUBMITTED, COMPLETED, REJECTED}
  
  token_value: Int
  deadline: Date
  max_nominees: Int
  
  // Assignments
  assigned_to_id: UUID? (FK → User)
  assigned_at: DateTime?
  
  // Proof
  proof_text: Text?
  proof_files: JSON? [{name, url, uploadedAt}]
  proof_submitted_at: DateTime?
  
  // Approval
  hod_reviewed_at: DateTime?
  hod_reviewed_by_id: UUID? (FK → HOD)
  hod_review_status: Enum {PENDING, APPROVED, REJECTED}
  hod_review_comments: Text?
}

Nomination {
  id: UUID
  task_id: UUID (FK → UnstructuredTask)
  faculty_id: UUID (FK → User)
  nominated_at: DateTime
  status: Enum {PENDING, SELECTED, REJECTED}
}
```

---

## Part 3: Progress Calculation & Salary Thresholds

### Progress % Formula

```
Total Progress % = (Structured Work Score × 0.7) + (Unstructured Work Score × 0.3)

Where:
  Structured Work Score = (Attended Classes / Scheduled Classes) × 100
  Unstructured Work Score = (Tokens Earned / Target Tokens for Semester) × 100
  Target Tokens per Semester = Based on org policy (e.g., 3000 tokens)
```

### Example: Faculty Progress

**Faculty: Dr. Sharma**
- **Structured Work**: 
  - Assigned: 15 classes/week
  - Attended: 14 classes this week (93%)
  - Score: 93%

- **Unstructured Work**:
  - Tokens earned this semester: 2500
  - Target tokens: 3000
  - Score: 83%

- **Total Progress**: (93 × 0.7) + (83 × 0.3) = 65.1 + 24.9 = **90%**

### Salary Thresholds

Once faculty reaches **85% progress**, they can:
1. Click "Initiate Salary Transfer" button
2. System requests HOD approval
3. HOD approves (or denies with reason)
4. System requests Finance approval  
5. Finance approves → Smart contract mints tokens if needed + transfers to faculty wallet
6. Transaction recorded immutably

**If rejected**: Faculty can reapply after proving additional work.

---

## Part 4: Token & Blockchain System

### Custodial Wallet Model

**Why Custodial?** Faculty aren't blockchain experts. We manage wallets on their behalf.

```
SYSTEM ARCHITECTURE:
  
  Director's Wallet (Hot Wallet)
    ├─ Holds minting rights for ERC-20 contract
    ├─ Controlled by Director via web UI
    └─ All salary tokens originate here
    
  Faculty Wallets (Generated per user)
    ├─ Address: Generated on first login
    ├─ Private Key: Encrypted with AES-256, stored in DB
    ├─ Faculty never sees private key (system manages)
    └─ Smart contract transfers tokens here automatically
    
  Finance Audit Wallet (Read-only)
    └─ Tracks all transactions for audit log
```

### Token Transfer Flow

```
1. FACULTY INITIATES
   Faculty clicks "Transfer Salary" → Progress ≥ 85%?
   
2. HOD APPROVES
   API call: POST /api/approvals/salary-transfer
   HOD review: ✓ Attendance is legit ✓ Tasks are complete
   Status: SALARY_TRANSFER_APPROVED
   
3. FINANCE APPROVES
   Finance review: ✓ Total tokens in budget
   Status: FINANCE_APPROVED
   
4. SMART CONTRACT EXECUTES
   Backend calls: contractInstance.transfer(facultyAddress, tokenAmount)
   Transaction: {from: director, to: faculty, amount, tx_hash}
   
5. DATABASE UPDATED
   tokens table: amount transferred, timestamp
   transactions table: complete audit trail
   users table: token_balance updated
   
6. REAL FIAT RELEASED (Out of scope - manual or external process)
   Finance manually transfers real salary based on verified tokens
```

### Smart Contract (ERC-20)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorkToken is ERC20, Ownable {
  address public director; // Only person who can mint
  
  mapping(address => bool) public approvedTransferers; // Finance approvers
  
  constructor(uint256 initialSupply) ERC20("WorkToken", "WORK") {
    director = msg.sender;
    _mint(director, initialSupply);
  }
  
  // Director approves Finance to transfer on their behalf
  function approveTransferer(address _finance) public onlyOwner {
    approvedTransferers[_finance] = true;
  }
  
  // Finance executes transfer after DB approval
  function transferSalary(address faculty, uint256 amount) public {
    require(approvedTransferers[msg.sender], "Not approved transferer");
    _transfer(director, faculty, amount);
  }
  
  // Minting new tokens (only director)
  function mint(uint256 amount) public onlyOwner {
    _mint(director, amount);
  }
}
```

---

## Part 5: Database Schema (Complete & Verified)

### User Management

```sql
users {
  id UUID PRIMARY KEY
  email STRING UNIQUE NOT NULL
  name STRING NOT NULL
  avatar_url STRING?
  employee_id STRING?        -- College roll / emp ID
  role ENUM {DIRECTOR, DEAN, HOD, FACULTY, FINANCE, ADMIN, ...}
  department_id UUID? FK     -- Who reports to which HOD
  organization_id UUID FK    -- Which institution/org
  wallet_address STRING?     -- Public blockchain address
  progress_percentage DECIMAL DEFAULT 0
  token_balance DECIMAL DEFAULT 0
  loan_balance DECIMAL DEFAULT 0
  skills JSON?               -- Enterprise: auto-detected
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

wallet_keys {
  id UUID PRIMARY KEY
  user_id UUID FK UNIQUE
  encrypted_private_key STRING  -- AES-256 encrypted
  created_at TIMESTAMP
}

roles {
  id UUID PRIMARY KEY
  name ENUM (same as user.role)
  organization_id UUID FK
  description STRING
}

role_permissions {
  id UUID PRIMARY KEY
  role_id UUID FK
  permission_name STRING (e.g., "APPROVE_SALARY_TRANSFER")
  granted BOOLEAN DEFAULT true
}
```

### Task System

```sql
structured_tasks {
  id UUID PRIMARY KEY
  user_id UUID FK            -- Professor
  subject STRING
  credits INT                -- 3 = 3 classes/week
  department_id UUID FK
  semester STRING            -- "2026-1"
  day_of_week ENUM
  start_time TIME
  end_time TIME
  scheduled_date DATE
  created_at TIMESTAMP
}

structured_task_attendance {
  id UUID PRIMARY KEY
  task_id UUID FK
  scheduled_date DATE
  faculty_id UUID FK
  marked_present BOOLEAN?
  marked_at TIMESTAMP?
  hod_approved BOOLEAN DEFAULT false
  hod_approved_at TIMESTAMP?
  approved_by_id UUID? FK
}

unstructured_tasks {
  id UUID PRIMARY KEY
  title STRING NOT NULL
  description TEXT NOT NULL
  department_id UUID FK
  posted_by_id UUID FK       -- HOD
  posted_at TIMESTAMP
  status ENUM {OPEN, NOMINATED, ASSIGNED, PROOF_SUBMITTED, COMPLETED, REJECTED}
  token_value INT
  deadline DATE
  max_nominees INT
  assigned_to_id UUID? FK    -- Selected faculty
  assigned_at TIMESTAMP?
  proof_text TEXT?
  proof_files JSON?
  proof_submitted_at TIMESTAMP?
  hod_reviewed_at TIMESTAMP?
  hod_reviewed_by_id UUID? FK
  hod_review_status ENUM {PENDING, APPROVED, REJECTED}
  hod_review_comments TEXT?
}

nominations {
  id UUID PRIMARY KEY
  task_id UUID FK
  faculty_id UUID FK
  nominated_at TIMESTAMP
  status ENUM {PENDING, SELECTED, REJECTED}
}
```

### Token & Finance

```sql
tokens {
  id UUID PRIMARY KEY
  user_id UUID FK
  amount DECIMAL NOT NULL
  balance_after DECIMAL
  transaction_type ENUM {EARNED, TRANSFERRED, BORROWED, REPAID}
  task_id UUID? FK
  created_at TIMESTAMP
}

transactions {
  id UUID PRIMARY KEY
  from_user_id UUID FK
  to_user_id UUID FK
  amount DECIMAL NOT NULL
  task_id UUID? FK
  approval_id UUID? FK
  blockchain_tx_hash STRING?
  status ENUM {INITIATED, HOD_APPROVED, FINANCE_APPROVED, BLOCKCHAIN_CONFIRMED, FAILED}
  created_at TIMESTAMP
  completed_at TIMESTAMP?
}

loans {
  id UUID PRIMARY KEY
  user_id UUID FK
  amount_requested DECIMAL
  status ENUM {PENDING, APPROVED, REJECTED, REPAID}
  requested_at TIMESTAMP
  approved_by_id UUID? FK (Director)
  approved_at TIMESTAMP?
  repay_by_date DATE
  repaid_at TIMESTAMP?
}

approvals {
  id UUID PRIMARY KEY
  type ENUM {ATTENDANCE, SALARY_TRANSFER, TASK_COMPLETION, LOAN}
  requestor_id UUID FK       -- Who requested
  approver_id UUID FK        -- Who's approving
  related_task_id UUID? FK
  related_transaction_id UUID? FK
  status ENUM {PENDING, APPROVED, REJECTED}
  comments TEXT?
  created_at TIMESTAMP
  completed_at TIMESTAMP?
}
```

---

## Part 6: Project Structure & Architecture

### Folder Organization

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Public: Login page
│   │   └── signup/page.tsx         # Public: Signup page
│   │
│   ├── (app)/                      # Protected: Auth required
│   │   ├── dashboard/page.tsx      # Role-based dashboard (single route)
│   │   ├── my-work/page.tsx        # Faculty: My tasks & progress
│   │   ├── task-pool/page.tsx      # Available tasks to nominate for
│   │   ├── team/page.tsx           # Department members (HOD view)
│   │   ├── finance/page.tsx        # Finance: Token balances & release
│   │   ├── approvals/page.tsx      # Approval workflows (HOD/Finance)
│   │   └── layout.tsx              # Auth middleware & protected layout
│   │
│   ├── api/                        # Server endpoints
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── verify/route.ts
│   │   ├── tasks/
│   │   │   ├── structured/route.ts
│   │   │   ├── unstructured/route.ts
│   │   │   └── nominations/route.ts
│   │   ├── approvals/
│   │   │   ├── attendance/route.ts
│   │   │   ├── salary-transfer/route.ts
│   │   │   └── task-completion/route.ts
│   │   ├── tokens/
│   │   │   ├── transfer/route.ts
│   │   │   └── balance/route.ts
│   │   └── finance/
│   │       ├── release-salary/route.ts
│   │       └── audit-log/route.ts
│   │
│   ├── globals.css                 # Design tokens + Tailwind directives
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
│
├── lib/
│   ├── db/
│   │   ├── queries/
│   │   │   ├── users.ts            # getCurrentUserWithPermissions(), etc.
│   │   │   ├── tasks.ts            # getUnstructuredTasks(), getStructuredTasks()
│   │   │   ├── attendance.ts       # getPendingAttendance(), approveAttendance()
│   │   │   ├── tokens.ts           # getTokenBalance(), transferTokens()
│   │   │   ├── organizations.ts    # getOrgStats(), getDepartmentProgress()
│   │   │   └── index.ts            # Re-exports all query functions
│   │   ├── supabase/
│   │   │   ├── client.ts           # Client-side Supabase instance
│   │   │   ├── middleware.ts       # Auth middleware
│   │   │   └── server.ts           # Server-side Supabase instance
│   │   ├── contracts/
│   │   │   └── WorkTokenABI.ts     # ERC-20 contract ABI
│   │   └── utils/
│   │       ├── crypto.ts           # Wallet encryption/decryption
│   │       └── blockchain.ts       # Smart contract interactions
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Current user + role
│   │   ├── usePermissions.ts       # Permission checking
│   │   ├── useRole.ts              # Role detection
│   │   └── useAsync.ts             # Generic async data fetching
│   │
│   └── utils/
│       ├── supabase/
│       │   ├── client.ts
│       │   ├── server.ts
│       │   └── middleware.ts
│       └── constants.ts            # App-wide constants
│
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx          # Role-based navigation
│   │   ├── AppNavbar.tsx           # Header with user menu
│   │   ├── RoleGate.tsx            # Permission wrapper
│   │   └── ProtectedLayout.tsx     # Auth + layout wrapper
│   │
│   ├── dashboard/
│   │   ├── DirectorDashboard.tsx   # Org overview
│   │   ├── HodDashboard.tsx        # Dept progress
│   │   ├── FacultyDashboard.tsx    # Task & progress
│   │   ├── FinanceDashboard.tsx    # Token management
│   │   └── DashboardShell.tsx      # Router logic
│   │
│   ├── tasks/
│   │   ├── StructuredTaskCard.tsx
│   │   ├── UnstructuredTaskCard.tsx
│   │   ├── TaskBoard.tsx           # Kanban: OPEN → NOMINATED → ASSIGNED → COMPLETED
│   │   ├── NominationForm.tsx
│   │   └── TaskProofForm.tsx
│   │
│   ├── approvals/
│   │   ├── AttendanceApprovalPanel.tsx
│   │   ├── SalaryTransferApproval.tsx
│   │   ├── TaskCompletionReview.tsx
│   │   └── LoanApprovalPanel.tsx
│   │
│   ├── common/
│   │   ├── LoadingSkeleton.tsx     # Generic loader UI
│   │   ├── ErrorFallback.tsx       # Generic error UI
│   │   ├── EmptyState.tsx          # No data UI
│   │   ├── ProgressRing.tsx        # Circular progress %
│   │   └── TokenBalanceWidget.tsx
│   │
│   └── ui/                         # shadcn/ui base components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── ... (others)
│
└── .env.development.local          # Local env vars (gitignored)
```

---

## Part 7: Development Patterns & Best Practices

### Pattern 1: Three-State Component (Loading → Success → Error)

Every component that fetches data follows this pattern:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/common/EmptyState';
import { getUnstructuredTasks } from '@/lib/db/queries/tasks';

export default function TaskPoolPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getUnstructuredTasks({ status: 'OPEN' });
        setTasks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} />;
  if (tasks.length === 0) return <EmptyState title="No Tasks Available" />;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Pattern 2: Query Layer (No Mock Data)

All database access goes through organized query functions:

```typescript
// lib/db/queries/tasks.ts

export async function getUnstructuredTasks(filters?: {
  departmentId?: string;
  status?: string;
}) {
  const supabase = createClient();
  let query = supabase.from('unstructured_tasks').select('*');
  
  if (filters?.departmentId) 
    query = query.eq('department_id', filters.departmentId);
  if (filters?.status) 
    query = query.eq('status', filters.status);
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
```

### Pattern 3: Permission Gates (RoleGate)

Wrap features that require permissions:

```typescript
<RoleGate requiredPermission="APPROVE_SALARY_TRANSFER">
  <SalaryTransferApprovalPanel />
</RoleGate>
```

RoleGate checks `users.role` + `role_permissions` table before rendering.

### Pattern 4: API Routes (Server-Side Approval Logic)

```typescript
// api/approvals/salary-transfer/route.ts

export async function POST(request: Request) {
  // 1. Verify user is authenticated
  const user = await getAuthUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  // 2. Verify HOD permission
  const hasPermission = await checkPermission(user.id, 'APPROVE_SALARY_TRANSFER');
  if (!hasPermission) return new Response('Forbidden', { status: 403 });
  
  // 3. Parse request
  const { facultyId, amount } = await request.json();
  
  // 4. Validate business logic
  const faculty = await getUser(facultyId);
  if (faculty.progressPercentage < 85) {
    return new Response('Progress below threshold', { status: 400 });
  }
  
  // 5. Create approval record
  const approval = await db.approvals.create({
    type: 'SALARY_TRANSFER',
    requestor_id: user.id,
    approver_id: user.id,
    status: 'FINANCE_PENDING',
  });
  
  // 6. Return success
  return new Response(JSON.stringify(approval), { status: 201 });
}
```

---

## Part 8: Design System (Comprehensive)

### Color Palette (Based on Adaptive Cards Design System)

```css
/* Primary Brand Color: Purple */
--primary: 7 89% 53%;                 /* #6d28d9 */
--primary-foreground: 0 0% 100%;      /* White text on purple */

/* Semantic Status Colors */
--success: 142 76% 36%;               /* Green - Approved, completed */
--warning: 38 92% 50%;                /* Amber - Pending, in progress */
--error: 0 84% 60%;                   /* Red - Rejected, error */
--info: 217 91% 60%;                  /* Blue - Information */

/* Neutral Palette */
--background: 0 0% 100%;              /* White (light mode) */
--foreground: 224 71% 4%;             /* Dark text */
--card: 0 0% 100%;                    /* Card background */
--secondary: 224 13% 91%;             /* Light gray for secondary UI */
--muted: 224 13% 91%;                 /* Muted text background */
--muted-foreground: 215 14% 34%;      /* Muted text color */

/* Dark Mode */
.dark {
  --background: 224 71% 4%;           /* Dark background */
  --foreground: 0 0% 98%;             /* Light text */
  --card: 224 71% 4%;
  --secondary: 224 9% 18%;
  --muted-foreground: 224 8% 56%;
}

/* Radius */
--radius: 0.5rem;                     /* 8px - All components */
```

### Typography System

```css
/* Fonts: Inter for everything (no serif, no decorative fonts) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Font Sizes & Hierarchy */
.text-xs { font-size: 12px; line-height: 1.5; }        /* Captions, badges */
.text-sm { font-size: 14px; line-height: 1.5; }        /* Body, labels */
.text-base { font-size: 16px; line-height: 1.6; }      /* Body text */
.text-lg { font-size: 18px; line-height: 1.6; }        /* Subheadings */
.text-xl { font-size: 20px; line-height: 1.5; }        /* Section titles */
.text-2xl { font-size: 24px; line-height: 1.4; }       /* Page titles */
.text-3xl { font-size: 30px; line-height: 1.3; }       /* Major headings */

/* Font Weights */
.font-normal { font-weight: 400; }    /* Regular body text */
.font-medium { font-weight: 500; }    /* Labels, secondary headings */
.font-semibold { font-weight: 600; }  /* Buttons, strong emphasis */
.font-bold { font-weight: 700; }      /* Main headings, emphasis */
```

### Spacing System (8px base)

```css
/* Margin & Padding (Tailwind scale, 4px increments) */
.p-1 { padding: 0.25rem; }            /* 4px */
.p-2 { padding: 0.5rem; }             /* 8px */
.p-3 { padding: 0.75rem; }            /* 12px */
.p-4 { padding: 1rem; }               /* 16px - Most common */
.p-6 { padding: 1.5rem; }             /* 24px */
.p-8 { padding: 2rem; }               /* 32px */

/* Gap (for flexbox/grid) */
.gap-2 { gap: 0.5rem; }               /* 8px */
.gap-4 { gap: 1rem; }                 /* 16px */
.gap-6 { gap: 1.5rem; }               /* 24px */
```

### Button System

```css
/* Button Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;              /* 8px vertical, 16px horizontal */
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 150ms ease-out;
}

/* Variants */
.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
.btn-secondary:hover {
  background-color: hsl(var(--muted));
}

.btn-danger {
  background-color: hsl(var(--error));
  color: white;
}
.btn-danger:hover {
  opacity: 0.9;
}

/* Sizes */
.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 12px;
}
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 16px;
}

/* States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Card/Container System

```css
/* Base Card */
.card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Variants */
.card-elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-flat {
  border: none;
  box-shadow: none;
}

/* Sections within cards */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid hsl(var(--border));
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
}
```

### Badge/Status Indicators

```css
/* Badge base */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

/* Variants (semantic) */
.badge-success {
  background-color: hsl(var(--success) / 0.1);
  color: hsl(var(--success));
}

.badge-warning {
  background-color: hsl(var(--warning) / 0.1);
  color: hsl(var(--warning));
}

.badge-error {
  background-color: hsl(var(--error) / 0.1);
  color: hsl(var(--error));
}

.badge-info {
  background-color: hsl(var(--info) / 0.1);
  color: hsl(var(--info));
}
```

### Forms & Input System

```css
/* Input base */
input, textarea, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  font-size: 14px;
  font-family: inherit;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: border-color 150ms;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
}

input:disabled {
  background-color: hsl(var(--muted));
  cursor: not-allowed;
  opacity: 0.6;
}

/* Labels */
label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

/* Error state */
.form-group.error input,
.form-group.error textarea,
.form-group.error select {
  border-color: hsl(var(--error));
  box-shadow: 0 0 0 3px hsl(var(--error) / 0.1);
}

.form-error {
  font-size: 12px;
  color: hsl(var(--error));
  margin-top: 0.25rem;
}
```

### Progress Ring (Task Progress Visualization)

```css
.progress-ring {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.progress-ring-circle {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.progress-ring-background {
  stroke: hsl(var(--muted));
  fill: none;
  stroke-width: 8;
}

.progress-ring-progress {
  stroke: hsl(var(--primary));
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 300ms ease-out;
}

.progress-ring-text {
  font-size: 28px;
  font-weight: 700;
  color: hsl(var(--primary));
  margin-top: -60px;
  text-align: center;
}

.progress-ring-label {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  margin-top: 8px;
}
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* sm: 640px */
@media (min-width: 640px) { }

/* md: 768px */
@media (min-width: 768px) { }

/* lg: 1024px */
@media (min-width: 1024px) { }

/* xl: 1280px */
@media (min-width: 1280px) { }

/* 2xl: 1536px */
@media (min-width: 1536px) { }
```

---

## Part 9: Current Status & Next Steps

### Phase 1 Complete ✓

- [x] Design system implemented (colors, typography, spacing, components)
- [x] Query layer created (`lib/db/queries/`)
- [x] Hooks for auth & permissions (`useAuth`, `usePermissions`, `useRole`)
- [x] Base components (LoadingSkeleton, ErrorFallback, RoleGate)
- [x] Page structure (dashboard, my-work, task-pool, team, finance, approvals)
- [x] Context documentation (DEVELOPMENT.md, implementation_plan.md)
- [x] Codebase cleanup (removed old mock pages)

### Phase 2: Role Dashboards (Next)

- [ ] DirectorDashboard component (org stats, dept progress)
- [ ] HodDashboard component (dept overview, faculty progress)
- [ ] FacultyDashboard component (my tasks, progress %, nominate tasks)
- [ ] FinanceDashboard component (token balances, release buttons)
- [ ] Implement three-state fetching for each dashboard
- [ ] API endpoints for real data (attendance, tasks, tokens)

### Phase 3: Task System

- [ ] UnstructuredTaskBoard component (OPEN → NOMINATED → ASSIGNED → COMPLETED)
- [ ] NominationForm component (self-nominate with message)
- [ ] TaskProofForm component (submit completion proof)
- [ ] API endpoints (POST task, nominate, approve)

### Phase 4: Approval Workflows

- [ ] AttendanceBatchApproval component (HOD approves weekly attendance)
- [ ] SalaryTransferApproval component (HOD → Finance → Smart contract)
- [ ] TaskCompletionReview component (HOD validates proof)
- [ ] Smart contract integration (actual token transfers)

### Phase 5: Polish & Deployment

- [ ] Error handling & retry logic
- [ ] Real-time notifications
- [ ] Audit logs & export
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment to production

---

## Key Principles (GOLDEN RULES)

1. **Zero Mock Data**: All components fetch real data from Supabase. No hardcoded lists, seed data, or placeholder content.
2. **Three States Always**: Every async component handles loading, error, and success states.
3. **Query Layer First**: Database access ONLY through `lib/db/queries/` functions.
4. **Permissions First**: Use RoleGate wrapper for any restricted feature.
5. **Design Tokens Only**: All styling via CSS variables. No hardcoded colors.
6. **Accessibility**: ARIA roles, semantic HTML, keyboard navigation, screen reader support.
7. **Error Handling**: Meaningful error messages, retry logic, graceful fallbacks.
8. **Audit Trail**: Every transaction, approval, and token transfer is immutable and logged.

---

## Important Files Reference

- `/src/app/(app)/dashboard/page.tsx` - Role router (shows different dashboard per role)
- `/src/lib/db/queries/` - All database queries (users, tasks, attendance, tokens, orgs)
- `/src/lib/hooks/` - Auth & permission hooks
- `/src/components/layout/RoleGate.tsx` - Permission wrapper
- `/src/components/common/` - LoadingSkeleton, ErrorFallback, EmptyState
- `/src/app/globals.css` - Design tokens (colors, typography, spacing, components)
- `/DEVELOPMENT.md` - Three-state pattern guide & debugging tips
- `/implementation_plan.md` - THIS FILE (comprehensive story + technical reference)

---

**Status**: Ready for Phase 2 team development. All team members should read this document end-to-end before writing code.

