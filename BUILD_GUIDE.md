# WorkToken SaaS - Build Guide

## ✅ Completed
- **Cleaned**: Deleted 30+ redundant .md files and 8 old dashboard components
- **Built**: 4 Role-based Dashboards with dynamic data structure from mockups
  - Faculty: Progress ring (82%), token balance, schedule, active commitments
  - HOD: Department stats, heatmap, approvals queue, loan tracking
  - Director: Institution-wide KPIs, token circulation, heatmap, active loans
  - Finance Admin: Salary control, faculty readiness, transaction audit log
- **Sidebar**: Role-based navigation already working per role
- **App Layout**: Authenticated layout with profile fetching from Supabase

## 🎯 Immediate Next Steps (Priority Order)

### 1. **API Endpoints for Dashboard Data**
Create backend APIs to fetch real data from Supabase:
- `/api/dashboard/faculty/[id]` - Get faculty progress, balance, schedule, tasks
- `/api/dashboard/hod/[dept_id]` - Get department stats, faculty list, approvals
- `/api/dashboard/director/[org_id]` - Get institution stats, heatmap, loans
- `/api/dashboard/finance` - Get faculty readiness, audit log, transaction history

### 2. **Database Schema Setup** 
Ensure Supabase tables exist:
- `users` - id, name, email, role, department_id, organization_id, progress_percentage, token_balance, loan_balance
- `tasks` - id, type (structured/unstructured), assigned_to, status, tokens_value, due_date
- `schedule` - id, faculty_id, subject, room, time_slot, date
- `approvals` - id, faculty_id, hod_id, type, status, amount, reason
- `transactions` - id, event_type, from_addr, to_addr, amount, timestamp

### 3. **Connect Dashboards to Real Data**
Replace mock data with SWR hooks fetching from APIs:
```typescript
const { data: profile } = useSWR(`/api/dashboard/faculty/${userId}`, fetcher);
```

### 4. **Build Other Pages**
- `/my-work` - Faculty schedule & attendance marking
- `/task-pool` - Browse & nominate unstructured tasks
- `/approvals` - HOD/Director approval queue
- `/team` - Manage department members
- `/settings` - Organization hierarchy, roles, rate cards

### 5. **Action Handlers**
- Mark attendance ✓
- Submit salary transfer request ✓
- Approve/reject requests ✓
- Nominate for tasks ✓
- Trigger batch reversal ✓

## 📁 File Structure
```
src/
├── app/(app)/
│   ├── dashboard/page.tsx       ✓ Routes to role dashboards
│   ├── my-work/page.tsx         (TODO)
│   ├── task-pool/page.tsx       (TODO)
│   ├── approvals/page.tsx       (TODO)
│   ├── team/page.tsx            (TODO)
│   └── settings/page.tsx        (TODO)
├── components/
│   ├── dashboard/
│   │   ├── FacultyDashboard.tsx ✓ Dynamic data structure
│   │   ├── HodDashboard.tsx     ✓ Dynamic data structure
│   │   ├── DirectorDashboard.tsx ✓ Dynamic data structure
│   │   └── GenericDashboard.tsx ✓ Finance Admin dashboard
│   └── layout/
│       └── AppSidebar.tsx       ✓ Role-based nav
└── api/
    ├── dashboard/
    │   ├── faculty/[id]/route.ts    (TODO)
    │   ├── hod/[dept_id]/route.ts   (TODO)
    │   ├── director/[org_id]/route.ts (TODO)
    │   └── finance/route.ts         (TODO)
    └── ... (other APIs)
```

## 🚀 To Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
# Login required (Supabase auth)
```

## 📊 Mockup Reference
- **Faculty Dashboard**: Shows 82% progress, 41 tokens earned of 50
- **HOD Dashboard**: Data Engineering dept, 150k tokens minted, 7 active loans
- **Director Dashboard**: Cross-institution overview, 15M tokens, 12 below threshold
- **Finance Admin**: Token reversal controls, 104 pending salary releases

**Status**: Clean architecture ready. Next: Connect to real Supabase data and build API endpoints.
