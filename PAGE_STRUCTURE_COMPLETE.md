# WorkToken - Complete Page Structure

## 📂 Route Organization

```
src/app/
├── (auth)
│   ├── login/
│   └── signup/
├── (app)
│   ├── dashboard/
│   ├── my-work/
│   ├── task-pool/
│   ├── approvals/
│   ├── team/
│   ├── finance/
│   ├── settings/
│   └── profile/
├── api/
└── layout.tsx
```

---

## 🔐 Authentication Routes

### 1. **Login Page** - `/login`
**Purpose**: User authentication entry point

**Components**:
- Email/Password input form
- Forgot password link
- Sign up redirect
- Error states (invalid credentials, server error)
- Loading state during submission

**Backend Tables**:
- `users` (email, password_hash, status)
- `audit_logs` (user_id, action, timestamp)

**Features**:
- Input validation (email format, password length)
- Session token generation
- Account status check (active/suspended/deleted)
- Rate limiting (5 attempts, 15-min cooldown)

---

### 2. **Sign Up Page** - `/signup`
**Purpose**: New user registration

**Components**:
- Full name input
- Email input (with verification)
- Password input with strength meter
- College/Organization dropdown (for college-specific template)
- Terms & conditions checkbox
- Sign up button

**Backend Tables**:
- `users` (name, email, password_hash, college_id, status, created_at)
- `audit_logs`
- `email_verifications` (email, token, expires_at)

**Features**:
- Email uniqueness check
- Password strength validation
- Email verification flow (token sent to email)
- College assignment (auto-detect or manual)
- Default role assignment based on college

---

## 🏠 Dashboard Routes

### 3. **Main Dashboard** - `/dashboard`
**Purpose**: Central hub showing overview of all user activities

**Components**:
- Welcome header (user name, role badge)
- Key metrics cards (tasks completed, tokens earned, pending approvals)
- Recent activity timeline
- Quick action buttons
- Tasks due soon (widget)
- Team notifications (widget)

**Backend Tables**:
- `users`
- `tasks` (status, assigned_to, created_by)
- `transactions` (type, amount, status)
- `approvals` (status, created_at)
- `notifications` (user_id, type, read, created_at)

**Features**:
- Real-time task count updates
- Conditional widgets based on role
- Quick filters (all/open/completed)
- Mobile-responsive grid layout

---

### 4. **My Work** - `/my-work`
**Purpose**: User's assigned tasks and work items

**Components**:
- Task list with filters (status, priority, due date)
- Task card (title, status badge, due date, assignee)
- Bulk action toolbar (mark complete, reassign, delete)
- Empty state (no tasks)
- Pagination/infinite scroll
- Search and sort controls

**Backend Tables**:
- `tasks` (id, title, description, status, assigned_to, priority, due_date)
- `task_attachments` (task_id, file_url, uploaded_at)
- `task_comments` (task_id, user_id, comment, created_at)
- `audit_logs`

**Features**:
- Drag-and-drop status update
- Inline editing (description, due date)
- Comment system per task
- File attachments
- Status transitions: Open → In Progress → Complete

---

### 5. **Task Pool** - `/task-pool`
**Purpose**: Available tasks for assignment (Manager/Admin view)

**Components**:
- Available tasks list
- Task creation modal
- Bulk assignment interface
- Search and filter controls
- Task templates dropdown

**Backend Tables**:
- `tasks`
- `task_templates` (name, description, category)
- `users`
- `assignments` (task_id, assigned_to, assigned_by, created_at)

**Features**:
- Create new tasks
- Assign multiple tasks to users
- Task templates for quick creation
- Priority assignment (Low, Medium, High, Critical)
- Role-based availability (only visible to managers/admins)

---

### 6. **Approvals** - `/approvals`
**Purpose**: Pending approvals workflow

**Components**:
- Approvals list (pending, approved, rejected)
- Approval detail modal
- Comments section for approval
- Approve/Reject/Request Changes buttons
- Status badge on each item

**Backend Tables**:
- `approvals` (id, type, status, created_by, reviewed_by, created_at)
- `approval_items` (approval_id, description, amount/details)
- `approval_comments` (approval_id, user_id, comment, created_at)
- `audit_logs`

**Features**:
- Role-based approval routing (Finance → Admin → CEO)
- Comments and feedback loop
- Attachment support
- Bulk approval actions
- Email notifications on status change

---

### 7. **Team** - `/team`
**Purpose**: Team members management and collaboration

**Components**:
- Team member list (profile, role, status, last active)
- Add member modal
- Member detail drawer
- Bulk actions (change role, deactivate, etc.)
- Team hierarchy visualization (org chart)

**Backend Tables**:
- `users` (with role, department, college_id)
- `team_members` (user_id, team_id, role, joined_at)
- `departments` (id, name, head_id, college_id)
- `roles` (id, name, permissions)

**Features**:
- Add/remove team members
- Change member roles
- View member activity
- Bulk role assignment
- Department management

---

### 8. **Finance** - `/finance`
**Purpose**: Financial transactions and wallet management

**Components**:
- Balance display card (current, pending, total earned)
- Transaction history table (type, amount, date, status)
- Withdrawal request form
- Payment method management
- Income summary chart

**Backend Tables**:
- `wallets` (user_id, balance, pending_balance, currency)
- `transactions` (user_id, type, amount, status, created_at)
- `withdrawals` (user_id, amount, method, status, created_at)
- `payment_methods` (user_id, type, details, verified)

**Features**:
- Real-time balance updates
- Transaction filtering and search
- Withdrawal request submission
- Payment method add/remove
- Income analytics by period

---

### 9. **Settings** - `/settings`
**Purpose**: User preferences and account settings

**Components**:
- Account settings section (name, email, password change)
- Notification preferences (email, in-app, sms)
- Privacy settings
- Connected integrations
- Export data option
- Delete account option

**Backend Tables**:
- `user_preferences` (user_id, notifications, privacy)
- `user_sessions` (user_id, token, device, expires_at)
- `integrations` (user_id, service, token)

**Features**:
- Change password
- Notification preferences toggle
- 2FA setup
- Session management
- Data export
- Account deactivation

---

### 10. **Profile** - `/profile`
**Purpose**: User profile view and editing

**Components**:
- Profile header (avatar, name, role, bio)
- Edit profile modal
- Work statistics (tasks, completions, rating)
- Activity feed
- Contact information
- Badges/achievements

**Backend Tables**:
- `users` (name, email, avatar, bio, role)
- `user_profiles` (bio, phone, location, social_links)
- `achievements` (user_id, type, earned_at)
- `ratings` (user_id, average_rating, review_count)

**Features**:
- Edit profile information
- Upload avatar
- View work history
- Display achievements/badges
- Public profile option (college-specific)

---

## 🎯 API Routes

### Authentication APIs
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register user
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/verify-email` - Verify email token

### Task APIs
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Approval APIs
- `GET /api/approvals` - List approvals
- `PATCH /api/approvals/:id/approve` - Approve item
- `PATCH /api/approvals/:id/reject` - Reject item
- `POST /api/approvals/:id/comments` - Add comment

### Financial APIs
- `GET /api/wallet` - Get wallet info
- `GET /api/transactions` - Transaction history
- `POST /api/withdrawals` - Request withdrawal
- `POST /api/payments/methods` - Add payment method

### User APIs
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile
- `GET /api/team` - List team members
- `POST /api/team/members` - Add team member

---

## 📊 Component Pattern - Every Page Uses

### Three-State Pattern
```
Loading → (skeleton/spinner)
Error → (error message + retry)
Success → (content)
```

### RoleGate Component
```
NEVER check role in JSX:
❌ {userRole === 'admin' && <Component />}

ALWAYS use wrapper:
✅ <RoleGate requiredRole="admin"><Component /></RoleGate>
```

### Error Boundary
```
Every page wrapped in error boundary
Shows user-friendly error message
Provides "Go back" / "Retry" options
```

---

## 🎨 Design System - Apply to All Pages

### Colors (from One UI)
- Primary: `#8F7AFF` (purple buttons, links, active states)
- Secondary: `#8644D7` (hover states)
- Cyan: `#00D4FF` (AI features, special highlights)
- Yellow: `#FFD700` (warnings)
- Success: `#24C856`
- Error: `#FF3B30`

### Spacing
- Small gap: 8px (p-2)
- Medium gap: 16px (p-4)
- Large gap: 24px (p-6)
- Page padding: 16px mobile, 24px desktop

### Border Radius
- Buttons: 12px
- Cards: 12px
- Dialogs: 24px
- Inputs: 12px

### Typography
- Page title: 36px, bold
- Section header: 24px, semibold
- Card title: 16px, semibold
- Body text: 14px, regular

---

## ✅ Implementation Checklist

For every page created:
- [ ] Route in correct folder (auth/ or app/)
- [ ] Layout wrapper with proper styling
- [ ] Three-state handling (loading/error/success)
- [ ] Error boundary wrapping
- [ ] RoleGate if restricted access
- [ ] One UI colors applied
- [ ] One UI fonts applied
- [ ] Responsive breakpoints tested
- [ ] Accessibility (alt text, ARIA labels)
- [ ] Backend query centralized in lib/db/queries/
- [ ] Audit logging for sensitive actions
- [ ] Loading spinners (not just text)
- [ ] Empty states designed

---

## 🔄 User Flow - Complete Journey

```
1. Anonymous User
   ↓
2. Login / Sign Up Page
   ↓
3. Email Verification (if signup)
   ↓
4. Dashboard (first login)
   ↓
5. Based on Role:
   - Manager → Task Pool, Approvals, Team
   - Employee → My Work, Dashboard
   - Admin → All pages + Settings
   - Finance → Finance, Approvals
   ↓
6. Complete Task → My Work → Dashboard update
   ↓
7. Request Withdrawal → Finance → Approvals
   ↓
8. Settings anytime
```

---

## 🎭 College-Specific vs Generic Template

### College Template Features
- `college_id` foreign key in users
- Department hierarchy tied to college
- College-specific roles (Dean, Faculty, Student Worker)
- Academic calendar integration
- Semester-based task cycles
- College-branded dashboard

### Generic (Enterprise) Template
- Organization hierarchy
- Custom role definitions
- Industry-agnostic task management
- Unlimited role nesting
- No academic calendar

**Routing**: Use subdomain or feature flag to switch templates
