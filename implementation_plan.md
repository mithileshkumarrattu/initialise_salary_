# WorkToken Platform — Implementation Plan

## Overview

A **Next.js** full-stack application that makes invisible work visible and links it to tamper-proof ERC-20 tokens. Supports two organizational templates: **College** (faculty salary token model) and **Generic Enterprise** (contribution/reputation token model). Built with **shadcn/ui**, **Supabase** (PostgreSQL + Auth), **Prisma ORM**, and a **custodial wallet system**.

> [!IMPORTANT]
> **Phase 1 (This Plan):** Set up the Next.js project, install all dependencies (shadcn/ui, Supabase, Prisma), create the complete page/route structure with placeholder layouts, and connect to the Supabase database. No mock data — real DB connection from day one.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| UI Library | shadcn/ui (Radix + Tailwind CSS) |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Auth (Google OAuth / SSO) |
| Blockchain | Ethers.js v6 (ERC-20, custodial wallets) |
| State | React Context + Server Components |
| Styling | Tailwind CSS (via shadcn/ui) |

---

## 2. Database Schema — All Entities & Attributes

### Core Tables (Both Templates)

#### `Organization`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | String | |
| type | Enum: `COLLEGE`, `ENTERPRISE` | Template selector |
| logo | String? | URL |
| createdAt | DateTime | |

#### `Department`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | String | |
| orgId | UUID (FK → Organization) | |
| hodId | UUID? (FK → User) | |
| createdAt | DateTime | |

#### `User`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | Matches Supabase Auth uid |
| email | String (unique) | |
| name | String | |
| avatarUrl | String? | |
| employeeId | String? | College roll / employee ID |
| role | Enum: `DIRECTOR`, `DEAN`, `HOD`, `FACULTY`, `FINANCE`, `ADMIN`, `EMPLOYEE`, `MANAGER`, `HR_ADMIN` | |
| departmentId | UUID? (FK → Department) | |
| orgId | UUID (FK → Organization) | |
| walletAddress | String? | Public address |
| progressPercentage | Decimal (default 0) | Cached |
| tokenBalance | Decimal (default 0) | Cached from chain |
| loanBalance | Decimal (default 0) | Cached |
| skills | JSON? | Enterprise: auto-detected skill map |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `WalletKeys` (Secure — separate table)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User, unique) | |
| encryptedPrivateKey | String | AES-256 encrypted |
| createdAt | DateTime | |

#### `RolePermissions`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| role | Enum (same as User.role) | |
| orgId | UUID (FK → Organization) | |
| canApproveSalaryTransfer | Boolean | |
| canPostTasks | Boolean | |
| canViewFinance | Boolean | |
| canManageUsers | Boolean | |
| canViewAuditLog | Boolean | |
| canManageSettings | Boolean | |

---

### Task System

#### `StructuredTask` (College: timetable-based)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User) | |
| taskType | String | e.g., "Lecture", "Lab", "Tutorial" |
| subject | String | |
| date | Date | |
| timeSlot | String | e.g., "09:00-10:00" |
| location | String? | Room/Hall |
| attendancePresent | Int? | |
| attendanceAbsent | Int? | |
| status | Enum: `UPCOMING`, `COMPLETED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED` | |
| creditsEarned | Decimal? | |
| approvedBy | UUID? (FK → User) | HOD who approved |
| createdAt | DateTime | |

#### `UnstructuredTask` (Both templates)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title | String | |
| description | String | |
| tokenPoints | Decimal | |
| departmentId | UUID? (FK → Department) | |
| orgId | UUID (FK → Organization) | |
| creatorId | UUID (FK → User) | |
| assignedToId | UUID? (FK → User) | |
| requiredSkills | JSON? | Enterprise: skill tags |
| deadline | DateTime? | |
| priority | Enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT` | |
| status | Enum: `OPEN`, `NOMINATED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `VERIFIED`, `REJECTED` | |
| aiSuggested | Boolean (default false) | Enterprise: from meeting pipeline |
| meetingActionItemId | UUID? | Link to source action item |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `Nomination`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| taskId | UUID (FK → UnstructuredTask) | |
| userId | UUID (FK → User) | |
| message | String? | |
| status | Enum: `PENDING`, `ACCEPTED`, `REJECTED` | |
| createdAt | DateTime | |

#### `TaskProof`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| taskId | UUID (FK → UnstructuredTask) | |
| userId | UUID (FK → User) | |
| fileUrl | String | Supabase Storage URL |
| description | String? | |
| submittedAt | DateTime | |
| verified | Boolean (default false) | |
| verifiedBy | UUID? (FK → User) | |

---

### Token & Financial System

#### `TokenTransaction`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| fromUserId | UUID? (FK → User) | null for mints |
| toUserId | UUID? (FK → User) | null for burns |
| amount | Decimal | |
| type | Enum: `MINT`, `SALARY_TRANSFER`, `LOAN_ISSUE`, `REVERSE_TRANSFER`, `LOAN_REPAY`, `TASK_REWARD`, `BONUS` | |
| txHash | String? | Blockchain tx hash |
| status | Enum: `PENDING`, `CONFIRMED`, `FAILED` | |
| notes | String? | |
| timestamp | DateTime | |

#### `Loan`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User) | |
| amount | Decimal | |
| remaining | Decimal | |
| reason | String? | |
| approvedBy | UUID? (FK → User) | |
| status | Enum: `PENDING`, `ACTIVE`, `REPAID`, `DEFAULTED` | |
| createdAt | DateTime | |
| clearedAt | DateTime? | |

#### `AttendanceBatch` (College)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| hodId | UUID (FK → User) | |
| departmentId | UUID (FK → Department) | |
| weekStart | Date | |
| weekEnd | Date | |
| approvedAt | DateTime? | |
| status | Enum: `DRAFT`, `SUBMITTED`, `APPROVED` | |

---

### Configuration

#### `RateCard`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| orgId | UUID (FK → Organization) | |
| taskType | String | e.g., "Lecture", "Lab", "Mentorship" |
| tokensPerHour | Decimal | |
| roleMultipliers | JSON | e.g., `{"HOD": 1.2, "Faculty": 1.0}` |
| effectiveDate | Date | |
| isActive | Boolean | |
| createdAt | DateTime | |

#### `SemesterCalendar` (College)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| orgId | UUID (FK → Organization) | |
| name | String | e.g., "Fall 2026" |
| startDate | Date | |
| endDate | Date | |
| markingPeriods | JSON | Array of date ranges |
| isActive | Boolean | |

---

### Enterprise-Specific Tables

#### `Integration`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| orgId | UUID (FK → Organization) | |
| userId | UUID? (FK → User) | Per-user or org-wide |
| provider | Enum: `GOOGLE_CALENDAR`, `SLACK`, `JIRA`, `GITHUB`, `GITLAB`, `TEAMS` | |
| accessToken | String (encrypted) | |
| refreshToken | String? (encrypted) | |
| status | Enum: `CONNECTED`, `DISCONNECTED`, `ERROR` | |
| lastSyncAt | DateTime? | |
| createdAt | DateTime | |

#### `ActivityEvent`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User) | |
| orgId | UUID (FK → Organization) | |
| source | Enum: `MEETING`, `COMMIT`, `DOCUMENT`, `TICKET`, `SLACK_THREAD`, `MANUAL` | |
| externalId | String? | ID from source system |
| title | String | |
| summary | String? | |
| detectedAt | DateTime | |
| confirmed | Boolean (default false) | "That's my work" button |
| tokenEquivalent | Decimal? | Computed from rate card |
| duration | Int? | Minutes |
| metadata | JSON? | Source-specific extra data |

#### `MeetingActionItem`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| activityEventId | UUID (FK → ActivityEvent) | Source meeting |
| assignedUserId | UUID? (FK → User) | |
| description | String | |
| status | Enum: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | |
| convertedToTaskId | UUID? (FK → UnstructuredTask) | |
| createdAt | DateTime | |

#### `CapacitySnapshot`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User) | |
| date | Date | |
| utilisationScore | Decimal | 0-100% |
| meetingHours | Decimal | |
| focusHours | Decimal | |
| taskHours | Decimal | |
| overloadRisk | Boolean | Burnout warning flag |

---

### Audit

#### `AuditLog`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| orgId | UUID (FK → Organization) | |
| actorId | UUID (FK → User) | |
| action | String | e.g., "TASK_CREATED", "SALARY_TRANSFERRED" |
| entityType | String | e.g., "UnstructuredTask", "TokenTransaction" |
| entityId | UUID | |
| before | JSON? | Previous state |
| after | JSON? | New state |
| ipAddress | String? | |
| timestamp | DateTime | |

#### `Notification`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID (FK → User) | Recipient |
| title | String | |
| message | String | |
| type | Enum: `INFO`, `WARNING`, `ACTION_REQUIRED`, `SUCCESS` | |
| link | String? | In-app route to navigate to |
| read | Boolean (default false) | |
| createdAt | DateTime | |

---

## 3. Page Structure & Route Map

### Shared Routes (Both Templates)

```
app/
├── (auth)/
│   ├── login/page.tsx              # Login with Google OAuth / SSO
│   ├── signup/page.tsx             # Organization setup + first admin
│   └── layout.tsx                  # Auth layout (centered card)
│
├── (app)/                          # Protected — requires auth
│   ├── layout.tsx                  # Sidebar + top nav + notification bell
│   │
│   ├── dashboard/page.tsx          # Role-adaptive landing page
│   │   ├── _components/
│   │   │   ├── director-dashboard.tsx
│   │   │   ├── hod-dashboard.tsx
│   │   │   ├── faculty-dashboard.tsx
│   │   │   ├── finance-dashboard.tsx
│   │   │   ├── employee-dashboard.tsx
│   │   │   ├── manager-dashboard.tsx
│   │   │   └── hr-dashboard.tsx
│   │
│   ├── my-work/page.tsx            # Personal work view
│   │   ├── _components/
│   │   │   ├── weekly-calendar.tsx       # College: timetable grid
│   │   │   ├── attendance-modal.tsx      # College: submit attendance
│   │   │   ├── progress-ring.tsx         # Circular progress SVG
│   │   │   ├── activity-timeline.tsx     # Enterprise: passive work feed
│   │   │   ├── confirm-work-button.tsx   # Enterprise: "That's my work"
│   │   │   ├── loan-request-modal.tsx    # Loan request form
│   │   │   ├── salary-initiate.tsx       # College: salary token transfer
│   │   │   └── token-balance-card.tsx    # Balance + loan status
│   │
│   ├── task-pool/page.tsx          # Task marketplace / kanban
│   │   ├── _components/
│   │   │   ├── task-board.tsx            # Kanban columns
│   │   │   ├── task-card.tsx             # Individual task card
│   │   │   ├── create-task-modal.tsx     # New task form
│   │   │   ├── nominate-modal.tsx        # Self-nomination
│   │   │   ├── task-detail-drawer.tsx    # Side panel with full details
│   │   │   ├── ai-suggestion-badge.tsx   # Enterprise: skill match badge
│   │   │   └── proof-upload.tsx          # File upload for completion
│   │
│   ├── team/page.tsx               # Manager/HOD team view
│   │   ├── _components/
│   │   │   ├── team-heatmap.tsx          # Utilisation heatmap grid
│   │   │   ├── member-card.tsx           # Individual member stats
│   │   │   ├── assign-task-modal.tsx     # Allocate task with fairness filter
│   │   │   ├── batch-attendance.tsx      # College: weekly batch approval
│   │   │   ├── approval-queue.tsx        # Pending salary/task approvals
│   │   │   ├── meeting-pipeline.tsx      # Enterprise: meeting → action items
│   │   │   └── underperformer-flag.tsx   # Flag for HR review
│   │
│   ├── finance/page.tsx            # Finance department view
│   │   ├── _components/
│   │   │   ├── token-circulation.tsx     # Minted vs held vs reversed
│   │   │   ├── department-balances.tsx   # Table of all faculty balances
│   │   │   ├── batch-reverse.tsx         # Salary day reverse transfer
│   │   │   ├── reconciliation.tsx        # Payroll reconciliation
│   │   │   └── export-report.tsx         # PDF/CSV export
│   │
│   ├── integrations/page.tsx       # Enterprise: manage connected tools
│   │   ├── _components/
│   │   │   ├── integration-card.tsx      # Provider tile
│   │   │   └── connect-modal.tsx         # OAuth flow trigger
│   │
│   ├── settings/page.tsx           # Admin/HR settings
│   │   ├── _components/
│   │   │   ├── org-structure.tsx         # Departments + hierarchy
│   │   │   ├── rate-card-editor.tsx      # Token values per task type
│   │   │   ├── user-management.tsx       # Bulk user CRUD
│   │   │   ├── csv-upload.tsx            # Timetable / user CSV upload
│   │   │   ├── semester-calendar.tsx     # College: semester config
│   │   │   ├── incentive-model.tsx       # Enterprise: bonus pool config
│   │   │   ├── blockchain-config.tsx     # Contract address, node endpoint
│   │   │   └── role-permissions.tsx      # Permission matrix editor
│   │
│   ├── audit/page.tsx              # Audit trail viewer
│   │   ├── _components/
│   │   │   ├── audit-table.tsx           # Filterable log table
│   │   │   └── transaction-detail.tsx    # On-chain tx detail
│   │
│   └── notifications/page.tsx      # Notification center
│       └── _components/
│           └── notification-list.tsx
│
├── api/                            # API Routes
│   ├── auth/
│   │   └── callback/route.ts       # Supabase OAuth callback
│   ├── wallet/
│   │   ├── create/route.ts         # Create custodial wallet
│   │   └── balance/route.ts        # Get token balance
│   ├── tasks/
│   │   ├── structured/route.ts     # CRUD structured tasks
│   │   ├── unstructured/route.ts   # CRUD unstructured tasks
│   │   └── nominate/route.ts       # Submit nomination
│   ├── tokens/
│   │   ├── transfer/route.ts       # Salary token transfer
│   │   ├── reverse/route.ts        # Batch reverse transfer
│   │   └── loan/route.ts           # Loan issue/repay
│   ├── attendance/
│   │   └── batch/route.ts          # Batch attendance approval
│   ├── users/
│   │   └── route.ts                # User management
│   └── audit/
│       └── route.ts                # Audit log query
│
├── layout.tsx                      # Root layout (fonts, theme provider)
├── page.tsx                        # Landing / redirect to dashboard
└── globals.css                     # Tailwind base + shadcn theme tokens
```

---

## 4. shadcn/ui Components Needed

We will install and use the following shadcn/ui components across the app:

### Layout & Navigation
| Component | Usage |
|---|---|
| `sidebar` | App sidebar with role-based nav links |
| `navigation-menu` | Top navigation bar |
| `breadcrumb` | Page breadcrumb trail |
| `separator` | Visual dividers |
| `sheet` | Mobile sidebar overlay |

### Data Display
| Component | Usage |
|---|---|
| `card` | Dashboard stat cards, task cards, member cards |
| `table` | Finance tables, audit logs, user management |
| `badge` | Task status, priority, role indicators |
| `avatar` | User avatars in team view |
| `progress` | Progress bars for utilization |
| `chart` | Token circulation charts, heatmaps |
| `calendar` | Weekly calendar view, semester calendar |
| `tabs` | Section switching within pages |

### Forms & Input
| Component | Usage |
|---|---|
| `form` | All forms (React Hook Form integration) |
| `input` | Text inputs |
| `textarea` | Task descriptions, loan reasons |
| `select` | Role selector, department picker |
| `checkbox` | Bulk selection, permissions |
| `switch` | Toggle settings |
| `slider` | Threshold configuration |
| `date-picker` | Deadline selection |
| `label` | Form labels |

### Feedback & Overlays
| Component | Usage |
|---|---|
| `dialog` | Attendance modal, loan request, create task |
| `drawer` | Task detail side panel |
| `alert` | Active loan banner, burnout warning |
| `alert-dialog` | Destructive confirmations |
| `toast` / `sonner` | Success/error notifications |
| `tooltip` | Icon explanations |
| `popover` | Quick actions, filter menus |
| `skeleton` | Loading states |

### Actions
| Component | Usage |
|---|---|
| `button` | All actions |
| `dropdown-menu` | Row actions, user menu |
| `command` | Search/command palette |
| `context-menu` | Right-click actions on tasks |

### Special
| Component | Usage |
|---|---|
| `scroll-area` | Scrollable panels |
| `collapsible` | Expandable sections in settings |
| `accordion` | FAQ, grouped settings |
| `hover-card` | User preview on hover |
| `aspect-ratio` | Proof image display |
| `resizable` | Resizable dashboard panels |

---

## 5. Key Pages — What Each Contains

### `/dashboard` — Role-Adaptive Landing

**Faculty/Employee:**
- Progress Ring (SVG) — current month completion %
- Token balance card (earned / target)
- "My Day" timeline — today's scheduled tasks
- Task suggestions from pool (matching skills/capacity)
- Active loan alert banner (if applicable)
- Quick actions: "Initiate Salary", "View Task Pool"

**HOD/Manager:**
- Team utilization heatmap (grid of members × days, color-coded)
- Pending approvals count (salary transfers, task completions)
- Department token circulation mini-chart
- Quick allocate: highlighted underutilized members
- Overload warnings for team members

**Director:**
- Cross-department token flow (Sankey/bar chart)
- Overall completion rate gauge
- Loan exposure summary
- Pending high-level approvals
- Org hierarchy quick view

**Finance:**
- Total minted vs held vs reversed tokens
- Department-wise balance table
- Salary day countdown / readiness indicator
- Recent transactions feed

### `/my-work` — Personal Work View

**College (Faculty/HOD):**
- Weekly timetable calendar (Mon-Sat, 8am-5pm grid)
- Each cell: Subject, Room, Status icon
- Click → Attendance Modal (present/absent counts, submit)
- Right panel: Progress Ring + Token Balance + Loan Status
- "Initiate My Salary" button (conditional on threshold)
- "Raise Loan Request" button (if below threshold)
- Active loan repayment tracker

**Enterprise (Employee):**
- Passive activity timeline (cards: meetings, commits, docs)
- Each card: source icon, title, time, "Confirm" button
- Manual "Log Work" button → modal
- Progress toward token goal (if incentive model active)
- Skills map (auto-updated tags)
- Burnout risk indicator + focus time suggestion

### `/task-pool` — Task Marketplace

- **Kanban board** with columns: Open → Nominated → Assigned → In Progress → Completed → Verified
- **Task cards**: title, token value badge, deadline, priority, required skills
- **Create Task** button (Manager/HOD) → modal with form
- **Nominate** button on open tasks → modal with optional message
- **AI Suggestion badges** (Enterprise): "Best match: Ravi, 40% capacity, skill match"
- **Proof upload** on assigned tasks → file upload area
- **Filter/sort**: by department, priority, token value, deadline, skills

### `/team` — Manager/HOD Team View

- **Member cards grid**: avatar, name, role, utilization %, token balance, active tasks count
- Color-coded: green (on track), yellow (at risk), red (overloaded/underperforming)
- **Assign Task modal**: select member, task from pool, fairness filter highlights
- **Batch attendance** (College): weekly grid, checkboxes, bulk approve
- **Approval queue**: pending salary transfers, task completions — approve/reject buttons
- **Meeting-to-Task pipeline** (Enterprise): meeting summaries → auto-generated action items → convert to tasks
- **Flag underperformer** action → sends to HR review

### `/finance` — Financial Oversight

- **Token circulation dashboard**: minted total, currently held by users, reversed, in loans
- **Department balances table**: sortable, filterable, with sparkline trends
- **Batch reverse transfer**: select salary period, preview amounts, confirm bulk reverse
- **Reconciliation check**: Director-Salary wallet balance vs expected
- **Export**: PDF report + CSV download buttons
- **Transaction audit log**: filtered view of TokenTransaction table

### `/integrations` — Enterprise Only

- **Provider tiles**: Google Calendar, Slack, Jira, GitHub, GitLab, Teams
- Each tile: icon, status badge (Connected/Disconnected), last sync time
- **Connect button** → OAuth flow
- **Disconnect** with confirmation
- **Sync now** manual trigger

### `/settings` — Configuration

- **Tabs**: Organization, Rate Cards, Users, Calendar, Blockchain, Permissions
- **Organization**: name, logo, type toggle (College/Enterprise), departments CRUD
- **Rate Cards**: table of task types × tokens/hour, role multipliers, effective date, version history
- **Users**: searchable table, bulk CSV upload, role assignment, department assignment
- **Calendar** (College): semester dates, marking periods
- **Incentive Model** (Enterprise): toggle variable pay, bonus pool config
- **Blockchain**: contract address, node RPC URL, admin wallet status
- **Permissions**: matrix of roles × permissions, editable checkboxes

### `/audit` — Audit Trail

- **Filterable table**: actor, action, entity type, timestamp range
- **Transaction detail**: click any token transaction → shows on-chain tx hash, block explorer link
- **Export** audit log as CSV

---

## 6. Execution Steps (Phase 1 — Setup & Structure)

### Step 1: Create Next.js App
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

### Step 2: Initialize shadcn/ui
```bash
npx -y shadcn@latest init -d
```

### Step 3: Install shadcn/ui Components (all needed)
```bash
npx -y shadcn@latest add button card input label form dialog drawer sheet sidebar table tabs badge avatar progress calendar checkbox switch select textarea tooltip popover dropdown-menu command alert alert-dialog toast separator breadcrumb scroll-area collapsible accordion hover-card skeleton chart sonner navigation-menu context-menu slider resizable aspect-ratio
```

### Step 4: Install Supabase Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 5: Set Up Environment Variables
```env

```

### Step 6: Create Supabase Client Utilities
- `src/lib/supabase/client.ts` — Browser client
- `src/lib/supabase/server.ts` — Server client (for Server Components & API routes)
- `src/lib/supabase/middleware.ts` — Auth middleware for protected routes

### Step 7: Create All Page Files & Layouts
- Auth layout + login/signup pages
- App layout with sidebar navigation
- All 8 main pages with placeholder components
- All `_components/` subdirectories with placeholder files
- All API route stubs

### Step 8: Connect to Supabase DB
- Set up Prisma with Supabase connection string (when your friend provides it)
- OR use Supabase client directly for now
- Verify connection with a simple query

---

## Open Questions

> [!IMPORTANT]
> **1. Supabase Anon Key:** The key you provided (`sb_publishable_BqC70w-o_aQVfuVHzZ2clw_7TZYDts9`) looks like a newer format. Do you also have the standard `NEXT_PUBLIC_SUPABASE_ANON_KEY`? We may need both depending on the Supabase JS client version.

> [!IMPORTANT]
> **2. Database Tables:** You mentioned your friend is creating tables. Should I:
> - (a) Create a Prisma schema and let Prisma manage migrations, OR
> - (b) Use the Supabase client directly to query tables your friend creates in the Supabase dashboard?

> [!IMPORTANT]
> **3. Auth Provider:** Should we use Supabase Auth with Google OAuth for now? Or do you have an institutional SSO provider already configured?

> [!IMPORTANT]
> **4. Organization Template:** For development, should we start with the **College** template as the primary and add Enterprise later? Or build both simultaneously?

> [!IMPORTANT]
> **5. Blockchain:** Should we set up a local Hardhat/Ganache node for development, or connect to a Polygon testnet? This can wait for Phase 2.

---

## Verification Plan

### After Phase 1 Completion
- `npm run dev` starts without errors
- All routes are accessible (return placeholder UI)
- Sidebar navigation works with role-based links
- Supabase client connects successfully (verified via a test query)
- shadcn/ui components render correctly with theming
- Dark mode toggle works
- Responsive layout works on mobile

