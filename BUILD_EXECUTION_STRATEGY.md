# BUILD EXECUTION STRATEGY - Role-Based Dashboard MVP

## Status: BUILDING NOW

---

## FINDINGS FROM CODEBASE AUDIT

### What Already Exists ✅
1. **Auth Pages**: Login & Signup working with Supabase
2. **Query Functions**: 10 query files (organizations, users, tasks, approvals, etc.)
3. **Design System**: One UI colors in globals.css (CSS variables set up)
4. **Database**: Connected to Supabase with proper tables

### What Needs Building ❌
1. **RoleGate Wrapper**: Access control component
2. **Role-Based Dashboards**: 4 dashboards (Director, HOD, Finance, Faculty)
3. **Middleware**: Check role on every page load
4. **Sidebar**: Navigation based on role
5. **Org Chart Manager**: CRUD for org nodes
6. **Approvals Page**: HOD approval workflow

---

## BUILD SEQUENCE (Critical Order)

### PHASE 1: Core Infrastructure (Must do first)
```
1. Create RoleGate wrapper (access control)
2. Create useAuth hook (get current user)
3. Create useRole hook (get current role)
4. Fix auth queries (use server client, not browser client)
5. Create middleware.ts (role check on page load)
```

### PHASE 2: Layout Components
```
6. Create Sidebar component (role-based nav)
7. Create AppLayout wrapper (sidebar + header)
8. Create WelcomeHeader component
```

### PHASE 3: Dashboard (Role-Specific)
```
9. Create dashboard page logic (role-based routing)
10. Create Director Dashboard (3 cards + org chart + activities)
11. Create HOD Dashboard (4 cards + dept view + pending approvals)
12. Create Finance Dashboard (4 cards + transactions)
13. Create Faculty Dashboard (3 cards + my tasks + status)
```

### PHASE 4: Role-Specific Pages
```
14. Create Org Chart Manager page + components (Director only)
15. Create Approvals page + components (HOD/Finance)
16. Create My Work page (Faculty)
17. Create Task Pool page (Faculty browse)
```

### PHASE 5: Database & CRUD
```
18. Create query functions for org node CRUD
19. Create API routes for org node operations
20. Create audit logging for all operations
21. Test all DB operations
```

### PHASE 6: Polish & Testing
```
22. Fix all errors
23. Test responsive design (mobile/tablet/desktop)
24. Test dark mode
25. Test role-based access
```

---

## KEY DECISIONS MADE

1. **Role Field**: Use `role` text field in users table (DIRECTOR, HOD, FINANCE, FACULTY)
2. **Org Structure**: Use `org_nodes` table for director to create org tree
3. **Access Control**: RoleGate wrapper + middleware (defense in depth)
4. **Data Flow**: Server Components fetch data → pass to Client Components
5. **Three-State**: Every component has loading/error/success states
6. **Colors**: Use CSS variables (hsl(var(--primary))) - NO hardcodes
7. **Navigation**: Sidebar visible on (app) routes only, hidden on (auth)

---

## Files to Create (Priority Order)

### Components
- [ ] src/components/common/RoleGate.tsx
- [ ] src/components/common/LoadingState.tsx
- [ ] src/components/common/ErrorState.tsx
- [ ] src/components/layout/Sidebar.tsx
- [ ] src/components/layout/Header.tsx
- [ ] src/components/layout/AppLayout.tsx
- [ ] src/components/dashboard/MetricsCard.tsx
- [ ] src/components/dashboard/WelcomeHeader.tsx
- [ ] src/components/dashboard/director/OrgChartWidget.tsx
- [ ] src/components/dashboard/director/FinancialOverview.tsx
- [ ] src/components/dashboard/hod/DepartmentOverview.tsx
- [ ] src/components/dashboard/hod/ApprovalsPending.tsx
- [ ] src/components/dashboard/finance/TransactionChart.tsx
- [ ] src/components/dashboard/faculty/MyTasksPreview.tsx
- [ ] src/components/org-structure/OrgChart.tsx
- [ ] src/components/org-structure/NodeCard.tsx
- [ ] src/components/org-structure/CreateNodeModal.tsx

### Hooks
- [ ] src/lib/hooks/useAuth.ts
- [ ] src/lib/hooks/useRole.ts
- [ ] src/lib/hooks/useAsync.ts

### Middleware
- [ ] src/middleware.ts

### Pages
- [ ] Update src/app/(app)/dashboard/page.tsx (role-based)
- [ ] src/app/(app)/org-structure/page.tsx
- [ ] src/app/(app)/approvals/page.tsx
- [ ] src/app/(app)/my-work/page.tsx

### API Routes
- [ ] src/app/api/org/create-node.ts
- [ ] src/app/api/org/update-node.ts
- [ ] src/app/api/org/delete-node.ts
- [ ] src/app/api/approvals/approve.ts
- [ ] src/app/api/approvals/reject.ts

### Queries
- [ ] Add org node CRUD queries to tasks.ts
- [ ] Add dashboard query functions

---

## Error Prevention Checklist

- ✅ All queries use `createClient()` from `/lib/supabase/server` (not browser client)
- ✅ All API routes check `x-user-role` header from middleware
- ✅ RoleGate protects all pages (access control)
- ✅ No hardcoded colors (#8F7AFF) - use CSS variables only
- ✅ All components have error boundaries
- ✅ All async operations have loading/error/success states
- ✅ TypeScript strict mode (no `any` type)
- ✅ Audit logs for all user actions

---

## Testing Scenarios

### Scenario 1: Director Workflow
```
1. Login as director@college.com
2. See dashboard with org metrics
3. Click "Org Structure"
4. Create a new department node
5. Verify node appears in tree
6. Verify audit log shows action
```

### Scenario 2: HOD Workflow
```
1. Login as hod@college.com
2. See dashboard with dept metrics
3. Click "Approvals"
4. See pending approvals
5. Approve one approval
6. Verify status changes to APPROVED
7. Verify audit log shows action
```

### Scenario 3: Faculty Workflow
```
1. Login as faculty@college.com
2. See personal dashboard
3. See "My Tasks" preview
4. Click "View All Tasks"
5. Only see own tasks (not others)
```

### Scenario 4: Access Control
```
1. Login as faculty
2. Try to access /org-structure
3. See 403 error (RoleGate blocks)
4. Login as director
5. Can access /org-structure
```

---

## SUCCESS METRICS

- ✅ Login/signup works end-to-end
- ✅ Dashboard loads for each role with correct data
- ✅ Role-based pages show only authorized content
- ✅ Org chart CRUD works (create/read/update/delete)
- ✅ Approvals workflow works
- ✅ Responsive on mobile/tablet/desktop
- ✅ No console errors or warnings
- ✅ Dark mode works
- ✅ Audit logs record all actions
- ✅ Loading states show for 1.5-2 seconds

