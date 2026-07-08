# WorkToken Platform - Master Specification (Updated with One UI Design System)

**Date**: July 2026
**Platform**: College-Specific + Generic Enterprise Template
**Design System**: One UI
**Font**: One UI Sans Variable

---

## 🎯 Project Overview

**WorkToken** is a tamper-proof contribution tracking and token-rewarding platform designed for colleges (primary) and enterprises (secondary). It enables institutions to fairly track student/employee work, create transparent incentive systems, and manage task workflows through blockchain-backed immutable audit trails.

### Key Differentiators
1. **Immutable Audit Trail** - Every transaction, approval, and action is logged permanently
2. **Dual-Template System** - Same codebase powers college + enterprise variants
3. **Financial Integration** - Built-in wallet, withdrawals, payment methods
4. **Approval Workflows** - Multi-level approval routes for financial transactions
5. **Role-Based Access** - Granular permission system (Admin, Manager, Finance, Employee)

---

## 🎨 One UI Design System Implementation

### Color Palette
**Primary Purple**: `#8F7AFF` (262° 100% 55%)
- Used for: Primary buttons, active links, headers
- Dark mode: `#E0C7FF` (lighter variant)

**Secondary Purple**: `#8644D7` (270° 68% 50%)
- Used for: Hover states, secondary actions

**Accent Cyan**: `#00D4FF` (188° 100% 50%)
- Used for: AI features, Galaxy AI highlights, special callouts

**Accent Yellow**: `#FFD700` (45° 100% 50%)
- Used for: Warning states, pending actions

**Semantic Colors**:
- Success: `#24C856` (green checkmarks, confirmations)
- Error: `#FF3B30` (destructive actions, errors)
- Info: `#64B5F6` (information badges)

**Neutrals - Light**:
- Background: `#FFFFFF`
- Text/Foreground: `#1A1B2E`
- Muted: `#E8E9F0`
- Border: `#E8E9F0`

**Neutrals - Dark**:
- Background: `#1F202E`
- Text: `#FAFAFA`
- Muted: `#3A3C52`
- Border: `#3A3C52`

### Typography
**Font Stack**: `One UI Sans` (variable weight 100-900) → `Inter` → system-ui

**Scale**:
- Title: 36px, 700 Bold, 1.2 line-height
- Heading: 24px, 600 Semibold, 1.3 line-height
- Subtitle: 20px, 700 Bold, 1.4 line-height
- Body: 14px, 400 Regular, 1.6 line-height
- Small: 12px, 400 Regular, 1.5 line-height

**Text Style**: Sentence case (first letter capital, rest lowercase)

### Spacing & Radius
**Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px
**Border Radius**:
- Small: 4px (buttons, badges)
- Standard: 12px (cards, inputs, dialogs)
- Large: 24px (modal backgrounds, hero sections)

### Blur Effects (Glassmorphism)
- **Light Blur**: `backdrop-filter: blur(48px)` with 50% opacity
- **Medium Blur**: `blur(36px)` with 60% opacity
- **Heavy Blur**: `blur(24px)` with 70% opacity
- Used for: Modal overlays, dialog backgrounds

---

## 📂 Complete Page Structure

### Authentication Routes (`/(auth)`)

#### 1. **Login Page** (`/login`)
- Email + password inputs
- Error states (invalid credentials, account suspended)
- "Forgot password" link
- "Sign up" redirect
- Loading state during API call
- Rate limiting feedback (5 attempts, 15-min cooldown)

**Backend**: `users` table (password verification), `audit_logs`

#### 2. **Sign Up Page** (`/signup`)
- Full name input
- Email input (with format validation)
- Password input with strength meter
- College/Organization dropdown (college-specific)
- Terms checkbox
- Email verification flow (token sent to email)

**Backend**: `users`, `email_verifications` (token, expires_at)

---

### Application Routes (`/(app)`)

#### 3. **Dashboard** (`/dashboard`)
**Role Access**: All authenticated users

- Welcome header (personalized greeting with user name + role)
- Key metrics cards:
  - Tasks completed (this week)
  - Tokens earned (this month)
  - Pending approvals (if manager/admin)
  - Current wallet balance
- Recent activity timeline (last 5 actions)
- Tasks due soon widget (next 7 days)
- Team notifications widget
- Quick action buttons (New Task, Request Withdrawal)

**Design**: 
- Use 3-column grid on desktop, 1-column on mobile
- Cards use One UI primary color for headers
- Charts/metrics use secondary purple accents

**Backend**: `users`, `tasks`, `transactions`, `approvals`, `notifications`

#### 4. **My Work** (`/my-work`)
**Role Access**: All users

- Task list with filters:
  - Status (Open, In Progress, Complete)
  - Priority (Low, Medium, High, Critical)
  - Due date range
- Task cards showing:
  - Task title (primary color link)
  - Status badge (color-coded)
  - Due date
  - Assignee avatar
  - Priority indicator
- Bulk actions (mark complete, reassign)
- Empty state (no tasks)
- Search bar
- Sort controls (by: due date, priority, created date)

**Design**:
- Cards have subtle One UI purple border on hover
- Status badges use semantic colors (green=complete, amber=in progress)
- Drag-and-drop status update with smooth animation

**Backend**: `tasks`, `task_comments`, `task_attachments`

#### 5. **Task Pool** (`/task-pool`)
**Role Access**: Manager, Admin only

- Available tasks list
- Create new task modal (title, description, assignee, priority, due date)
- Bulk assignment interface (select multiple tasks → assign to user)
- Task templates dropdown (for quick creation)
- Search and filter
- Priority visual indicators (color bars)

**Design**:
- Primary color for "Create Task" button
- Use Galaxy AI cyan for "AI-suggested tasks" (future feature)

**Backend**: `tasks`, `task_templates`, `assignments`

#### 6. **Approvals** (`/approvals`)
**Role Access**: Manager, Finance, Admin

- Pending approvals list (showing count badge)
- Approved/Rejected tabs
- Each approval item shows:
  - Type (Withdrawal, Budget, Report, etc.)
  - Amount (if financial)
  - Requester name
  - Status badge
  - Created date
  - Action buttons (Approve, Reject, Request Changes)
- Approval detail modal with:
  - Full description
  - Attachments
  - Comments section
  - Approval routing history

**Design**:
- Status badges: amber for pending, green for approved, red for rejected
- Primary color for Approve button, error color for Reject
- Comments section uses light background (muted color)

**Backend**: `approvals`, `approval_items`, `approval_comments`, `audit_logs`

#### 7. **Team** (`/team`)
**Role Access**: Manager, Admin only

- Team member list with columns:
  - Name + avatar
  - Role (Admin, Manager, Employee, Finance)
  - Department (college-specific) / Team (enterprise)
  - Status (Active, Inactive, Invited)
  - Last active timestamp
- Add member modal (name, email, role, department)
- Member detail drawer (profile, history, actions)
- Bulk actions (change role, deactivate, remove)
- Org chart visualization (team hierarchy)

**Design**:
- Use primary color for role badges
- Green indicator for "active", gray for "inactive"
- Org chart uses lines connecting to secondary purple boxes

**Backend**: `users`, `team_members`, `departments`, `roles`

#### 8. **Finance** (`/finance`)
**Role Access**: All users (for their own wallet), Finance/Admin (for all)

- Balance display card:
  - Current balance (primary color highlight)
  - Pending balance (awaiting approval)
  - Total earned (all-time)
- Transaction history table:
  - Date, type, amount, status
  - Status badges (completed, pending, failed)
  - Sort and filter controls
- Withdrawal request form:
  - Amount input
  - Payment method dropdown
  - Reason/notes textarea
- Payment method management:
  - Add new method
  - Delete existing
- Income summary chart (bar chart showing earnings by period)

**Design**:
- Use Galaxy AI cyan for "earned" amounts
- Use error red for "pending" amounts
- Charts use primary and secondary purple
- Withdrawal button prominent in primary color

**Backend**: `wallets`, `transactions`, `withdrawals`, `payment_methods`

#### 9. **Settings** (`/settings`)
**Role Access**: All users (personal), Admin (system)

- Account settings:
  - Name, email (read-only), avatar upload
  - Password change form
- Notification preferences:
  - Email notifications (toggle)
  - In-app notifications (toggle)
  - SMS notifications (toggle)
  - Notification types (tasks, approvals, transactions)
- Privacy settings:
  - Public profile option
  - Activity visibility
- Connected integrations:
  - Display connected services
  - Disconnect option
- Export data (CSV download of personal data)
- Delete account (dangerous zone with confirmation)

**Design**:
- Settings organized in sections with headers (One UI heading style)
- Toggles use primary purple color
- Dangerous actions (delete) use error red

**Backend**: `user_preferences`, `user_sessions`, `integrations`

#### 10. **Profile** (`/profile`)
**Role Access**: All users (own), College students (public)

- Profile header:
  - Avatar (clickable to upload in edit mode)
  - Name, role, department/college
  - Bio/short description
  - Edit button (edit mode for own profile)
- Work statistics:
  - Tasks completed
  - Total tokens earned
  - Average rating (if applicable)
  - Weeks active
- Activity feed (recent 10 actions)
- Achievements/badges (if earned)
- Contact information (if public)

**Design**:
- Use primary color for edit button
- Achievements displayed as colorful badges
- Avatar circle with subtle shadow

**Backend**: `users`, `user_profiles`, `achievements`, `ratings`

---

## 🔗 API Routes Documentation

### Authentication (`/api/auth`)
- `POST /auth/login` - Email + password, returns session token
- `POST /auth/signup` - Name, email, password, college_id, returns session
- `POST /auth/logout` - Invalidate session
- `POST /auth/refresh` - Refresh expired token
- `POST /auth/verify-email` - Verify email with token

### Tasks (`/api/tasks`)
- `GET /tasks` - List with filters (status, priority, assignee)
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update status (triggers audit log)
- `POST /tasks/:id/comments` - Add comment

### Approvals (`/api/approvals`)
- `GET /approvals` - List pending approvals
- `PATCH /approvals/:id/approve` - Approve item
- `PATCH /approvals/:id/reject` - Reject item
- `POST /approvals/:id/comments` - Add comment
- `GET /approvals/:id/history` - Get approval routing history

### Finance (`/api/finance`)
- `GET /wallet` - Get user wallet
- `GET /transactions` - Transaction history with filters
- `POST /withdrawals` - Request withdrawal (creates approval)
- `POST /payments/methods` - Add payment method
- `DELETE /payments/methods/:id` - Remove payment method

### Users (`/api/users`)
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update profile
- `GET /team` - List team members
- `POST /team/members` - Add team member
- `PATCH /users/:id/role` - Change user role (admin only)

---

## 🏗️ Database Schema Highlights

### Core Tables
**users**
- id, email, password_hash, name, avatar_url, role, college_id
- status (active, suspended, deleted)
- created_at, updated_at

**tasks**
- id, title, description, status, priority
- assigned_to, created_by
- due_date, created_at

**approvals**
- id, type (withdrawal, budget, report)
- status (pending, approved, rejected)
- created_by, reviewed_by
- created_at, reviewed_at

**transactions**
- id, user_id, type, amount, status
- created_at

**wallets**
- user_id, balance, pending_balance, currency

**audit_logs** (immutable)
- id, user_id, action, resource_type, resource_id
- old_value, new_value, timestamp

---

## 🎯 Component Patterns (Golden Rules)

### 1. Three-State Pattern
Every data-fetching component uses:
```
Loading → (skeleton/spinner in primary color)
Error → (error message + retry button)
Success → (actual content)
```

### 2. RoleGate Wrapper
NEVER check role in JSX:
```javascript
// ❌ WRONG
{userRole === 'admin' && <AdminPanel />}

// ✅ RIGHT
<RoleGate requiredRole="admin">
  <AdminPanel />
</RoleGate>
```

### 3. Centralized Queries
NEVER write queries in components:
```javascript
// ✅ ALL queries in: lib/db/queries/
export async function getUserTasks(userId) { ... }
```

### 4. Query Layer Pattern
Every query function:
- Takes userId as first parameter (for RLS)
- Uses parameterized queries (prevent SQL injection)
- Throws custom error types
- Returns typed results

### 5. Error Boundary
Every page wrapped in error boundary showing:
- User-friendly error message
- "Go back" button
- "Retry" button

### 6. Color Implementation
NEVER hardcode colors:
```css
/* ✅ RIGHT */
background-color: hsl(var(--primary));

/* ❌ WRONG */
background-color: #8F7AFF;
```

### 7. Audit Logging
Every sensitive action logs to audit_logs:
- User ID, action type, resource, timestamp
- Old and new values for updates
- Query results verified before logging

### 8. Type Safety
All TypeScript types in:
```
lib/types/
├── auth.ts
├── tasks.ts
├── approvals.ts
├── finance.ts
└── index.ts (exports all)
```

---

## 🎭 College vs Enterprise Templates

### College Template
- `college_id` in all relevant tables
- Roles: Admin, Dean, Faculty Manager, Student
- Department hierarchy tied to college
- Semester calendar integration
- Task cycles align with academic periods
- College-branded dashboard theme

### Enterprise Template
- `organization_id` (generic)
- Custom role definitions
- Department hierarchy independent
- Calendar agnostic
- Year-round task management
- Generic dashboard theme

**Routing Strategy**: Feature flag or subdomain to toggle template

---

## ✅ Immediate Implementation Tasks

1. **Design System** - One UI tokens fully implemented ✓
2. **Font Setup** - One UI Sans loaded from /public/fonts/ ✓
3. **Color Tokens** - All CSS variables defined in globals.css ✓
4. **Page Structure** - 10 pages ready for implementation
5. **API Layer** - Query functions centralized (in progress)
6. **Components** - RoleGate, ErrorBoundary, LoadingState built
7. **Database** - Schema finalized with audit tables
8. **Authentication** - Supabase + Better Auth integrated

---

## 📋 For Team Members Building Pages

When assigned a page, paste the corresponding prompt from `PAGE_BUILDING_TEMPLATE.md` that specifies:
- Route location
- Which components to create
- Backend query functions needed
- Design system colors/spacing to use
- Three-state handling
- Error cases
- Mobile responsive breakpoints

---

## 🚀 Success Criteria

- All pages render without hardcoded colors (use CSS variables)
- Every page implements three-state pattern
- All user actions logged in audit_logs
- Mobile responsive (320px-1024px minimum)
- Accessibility WCAG 2.1 AA (alt text, ARIA labels)
- One UI design system consistently applied
- Zero mock data (all from database)
- Type-safe TypeScript throughout
- Error messages helpful and actionable
