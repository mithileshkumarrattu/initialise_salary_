# WorkToken SaaS Platform - Faculty Productivity & Token Rewarding

## 🎯 What This Is

A **work accountability platform for academic institutions** where:
- **Directors** oversee token circulation across departments
- **HODs** approve work progress and manage their department
- **Faculty** track their work, earn tokens, and request salary transfers
- **Finance** controls the final salary release trigger

Token-based system: Faculty complete structured (timetable) + unstructured (special tasks) work → earn WORK tokens → request salary when ≥85% progress → Finance approves batch reversal → Salary released.

---

## 📦 Current Project Status

### ✅ COMPLETED
1. **4 Complete Role-Based Dashboards**
   - Faculty Dashboard: 82% progress ring, token balance, schedule, active commitments
   - HOD Dashboard: Department stats, heatmap, approvals, loan tracking
   - Director Dashboard: Institution-wide KPIs, token circulation, loan management
   - Finance Dashboard: Salary control, faculty readiness, audit log

2. **Authentication & Routing**
   - Supabase auth integration
   - Role-based navigation sidebar
   - Protected app layout

3. **Project Cleanup**
   - Removed 30+ redundant .md documentation files
   - Removed 8 old/duplicate dashboard components
   - Clean, focused codebase

### 🚧 TODO (Next Phase)
1. Database schema validation (Supabase tables)
2. API endpoints for each role dashboard
3. Data fetching with SWR hooks
4. Other pages: My Work, Task Pool, Approvals, Team, Settings
5. Action handlers: Mark attendance, submit transfers, approve requests

---

## 🚀 Quick Start

### Setup
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Visit http://localhost:3000
# Will redirect to login (Supabase required)
```

### Test Different Roles
Update the `role` in Supabase `users` table to test:
- `faculty` → Faculty Dashboard
- `hod` → HOD Dashboard
- `dean` → HOD Dashboard
- `director` → Director Dashboard
- `finance` → Finance Dashboard
- `admin`/other → Generic Dashboard

---

## 📂 Project Structure

```
/src
├── /app
│   ├── /(app)/
│   │   ├── dashboard/page.tsx          ✅ Role router
│   │   ├── my-work/page.tsx            🚧 TODO
│   │   ├── task-pool/page.tsx          🚧 TODO
│   │   ├── approvals/page.tsx          🚧 TODO
│   │   ├── team/page.tsx               🚧 TODO
│   │   ├── settings/page.tsx           🚧 TODO
│   │   └── layout.tsx                  ✅ Auth check
│   ├── /(auth)/
│   │   ├── login/page.tsx              ✅
│   │   └── signup/page.tsx             ✅
│   └── /api
│       ├── /dashboard/                 🚧 TODO (4 endpoints)
│       ├── /tasks/                     🚧 TODO
│       ├── /attendance/                🚧 TODO
│       └── /approvals/                 🚧 TODO
├── /components
│   ├── /dashboard
│   │   ├── FacultyDashboard.tsx        ✅ Dynamic data ready
│   │   ├── HodDashboard.tsx            ✅ Dynamic data ready
│   │   ├── DirectorDashboard.tsx       ✅ Dynamic data ready
│   │   └── GenericDashboard.tsx        ✅ Finance Admin dashboard
│   └── /layout
│       └── AppSidebar.tsx              ✅ Role-based nav
├── /lib
│   └── /supabase
│       ├── client.ts                   ✅
│       └── server.ts                   ✅
└── /utils
    └── /supabase
        └── client.ts                   ✅
```

---

## 🎨 Design System

**Colors**: Primary (blue), Success (green), Warning (orange), Error (red), Muted (gray)  
**Typography**: Inter font, responsive sizes  
**Components**: Card-based, Tailwind CSS, Lucide icons  
**Layout**: Sidebar + Main content, mobile responsive

---

## 🔐 Authentication Flow

```
User → Login/Signup (Supabase)
   ↓
AppLayout: Fetch user role from DB
   ↓
Route to dashboard based on role
   ↓
Dashboard shows role-specific UI
```

---

## 📊 Data Flow (Once APIs Connected)

```
User clicks action (e.g., "Mark Attendance")
   ↓
API call to /api/attendance/mark
   ↓
Update Supabase DB
   ↓
SWR hook refetch
   ↓
Dashboard re-renders with new data
```

---

## 📚 Key Roles & Responsibilities

### Faculty
- View progress toward 85% threshold
- Mark attendance for structured sessions
- Nominate for unstructured tasks
- Request salary transfer when eligible
- View active commitments

### HOD (Head of Department)
- Approve/reject salary transfer requests
- Create unstructured tasks for department
- View department progress heatmap
- Monitor faculty attendance
- Allocate task nominees

### Director
- Institution-wide overview
- Approve loans for faculty below threshold
- Monitor department performance
- View token circulation statistics
- Final loan approval authority

### Finance Admin
- See all faculty token balances
- Verify batch readiness for reversal
- Trigger final salary transfer
- View transaction audit log
- Control salary release timing

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 (App Router)
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password)
- **UI**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State**: React hooks + SWR for caching
- **Forms**: React Hook Form + Zod validation

---

## 📖 Documentation

- **BUILD_GUIDE.md** - Development roadmap & API specs
- **DASHBOARDS_SUMMARY.md** - Visual layout & architecture
- **README.md** - This file

---

## 💡 Important Notes

1. **Mock Data Ready**: All dashboards use realistic data structures matching mockups
2. **No Real Data Yet**: Swap mock arrays with API responses when ready
3. **Role Guards**: Layout redirects to login if not authenticated
4. **Database Not Set Up**: Supabase tables need to be created first
5. **API Endpoints Empty**: Need to build 4+ dashboard endpoints

---

## 🎯 Next 3 Steps to MVP

1. **Setup Supabase Tables** (1 hour)
   - Create schema for users, tasks, schedule, approvals, transactions
   - Add test data

2. **Build API Endpoints** (2-3 hours)
   - `/api/dashboard/faculty/[id]`
   - `/api/dashboard/hod/[dept_id]`
   - `/api/dashboard/director/[org_id]`
   - `/api/dashboard/finance`

3. **Connect Dashboards to Real Data** (1 hour)
   - Replace mock data with SWR hooks
   - Test with actual Supabase queries

**Estimated time to functional MVP: 4-5 hours**

---

## 📞 Support

- Check BUILD_GUIDE.md for API specifications
- Check DASHBOARDS_SUMMARY.md for UI/UX reference
- Review existing dashboard components for data structure patterns
- Supabase docs: https://supabase.com/docs

---

**Last Updated**: Latest build  
**Status**: Clean dashboards ready for data integration  
**Next Phase**: Backend API + Database Schema
