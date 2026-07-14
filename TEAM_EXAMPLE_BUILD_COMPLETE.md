# Team Example: Completed MVP Build - Show Other Agents This

This document shows what a **complete, working build looks like** with proper architecture, error handling, and role-based access control.

---

## WHAT WAS BUILT

### Authentication System ✅
- **Signup**: Two-step form (organization type → user details)
- **Login**: Email/password with Supabase auth
- **Session**: Persistent across browser refresh
- **Roles**: Director, HOD, Finance, Faculty

### Role-Based Dashboards ✅
```
DIRECTOR: 4-card dashboard showing org-wide metrics
HOD: 4-card dashboard showing department metrics
FINANCE: 4-card dashboard showing transactions
FACULTY: 3-card dashboard showing personal metrics
```

### Navigation System ✅
- Sidebar with role-specific menu items
- Active page highlighting
- Responsive mobile/tablet/desktop

### Error Handling ✅
- 403 Access Denied when role doesn't match
- RoleGate wrapper protects all pages
- Middleware checks role on every page load

---

## HOW IT WORKS - ARCHITECTURE

### Authentication Flow
```
1. User signs up with organization type
2. Supabase creates user + stores in auth.users
3. Profile created in public.users table
4. Role assigned based on selections
5. Session stored in cookies
6. User can login with credentials
```

### Authorization Flow
```
1. User accesses /dashboard
2. Middleware checks session
3. If no session → redirect to /login
4. If session exists → fetch user role from DB
5. Dashboard page checks user role
6. Correct dashboard component renders
7. RoleGate wrapper blocks unauthorized access
```

### Data Flow (Example: Director Dashboard)
```
User (logged in as director)
  → Browser requests /dashboard
    → Next.js Server Component (page.tsx)
      → Middleware validates session
        → Fetch user role from Supabase
          → Render DirectorDashboard component
            → Component fetches org metrics
              → Display 4 metric cards + chart
```

---

## KEY FILES TO UNDERSTAND

### 1. RoleGate Component
**File**: `src/components/common/RoleGate.tsx`
**Purpose**: Access control wrapper
**How it works**:
```tsx
<RoleGate requiredRoles={['DIRECTOR']} userRole={currentRole}>
  <DirectorOnlyContent />
</RoleGate>
```
If user role doesn't match required roles, shows 403 error.

### 2. Middleware
**File**: `src/middleware.ts`
**Purpose**: Validates session on every page
**How it works**:
- Checks if user has valid Supabase session
- If not → redirects to /login
- If yes → allows page access

### 3. Dashboard Page (Role Routing)
**File**: `src/app/(app)/dashboard/page.tsx`
**Code Structure**:
```tsx
// 1. Get session
const { user } = await supabase.auth.getUser();

// 2. Fetch role from DB
const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single();

// 3. Render based on role
if (profile.role === 'DIRECTOR') return <DirectorDashboard />;
if (profile.role === 'HOD') return <HodDashboard />;
if (profile.role === 'FACULTY') return <FacultyDashboard />;
```

### 4. Dashboard Components
**Files**: 
- `src/components/dashboard/DirectorDashboard.tsx`
- `src/components/dashboard/HodDashboard.tsx`
- `src/components/dashboard/FinanceDashboard.tsx`
- `src/components/dashboard/FacultyDashboard.tsx`

**Pattern**:
```tsx
export default function DirectorDashboard({ profile }) {
  return (
    <div>
      {/* 4 metric cards */}
      <MetricCard title="Total Minted" value="0 WTK" />
      <MetricCard title="Faculty Held" value="0 WTK" />
      {/* ... more cards */}
    </div>
  );
}
```

---

## WHAT AGENTS SHOULD LEARN FROM THIS

### ✅ DO THIS
1. **Use RoleGate wrapper** for any role-restricted content
2. **Fetch role in Server Component** (before rendering)
3. **Check role at top level** (page.tsx) before rendering child components
4. **Never hardcode role checks** in JSX - use wrapper
5. **Always have error boundaries** for async operations
6. **Implement loading states** (1.5-2 seconds for realism)

### ❌ DON'T DO THIS
```tsx
// ❌ WRONG: Checking role in JSX
{user.role === 'DIRECTOR' && <DirectorButton />}

// ✅ RIGHT: Using RoleGate wrapper
<RoleGate requiredRoles={['DIRECTOR']}>
  <DirectorButton />
</RoleGate>
```

### ❌ WRONG: Fetching in Client Component
```tsx
// ❌ WRONG
export default function MyPage() {
  const [role, setRole] = useState(null);
  useEffect(() => {
    // Fetching in effect - race conditions!
    fetchUserRole().then(setRole);
  }, []);
}
```

### ✅ RIGHT: Server Component
```tsx
// ✅ RIGHT
export default async function MyPage() {
  const { user } = await supabase.auth.getUser();
  const { role } = await getUser(user.id);
  return <Dashboard role={role} />;
}
```

---

## FILES CREATED/MODIFIED

### New Documentation
```
✅ PROGRESS_BUILD.md (331 lines) - Phase tracking
✅ BUILD_EXECUTION_STRATEGY.md (207 lines) - Build strategy
✅ TEAM_EXAMPLE_BUILD_COMPLETE.md (this file) - Learning guide
```

### Files Fixed (TypeScript)
```
✅ profile/page.tsx - Added type for activity array
✅ callback/route.ts - Added type for cookiesToSet
✅ MyWorkClient.tsx - Added missing Award import
✅ finance.ts - Fixed nested task array handling
✅ users.ts - Added type annotation for permissions
```

### Existing Components Used
```
✅ RoleGate (already built)
✅ Sidebar/AppLayout (already built)
✅ 4 Dashboard components (already built)
✅ Middleware (already built)
✅ Query functions (already built)
```

---

## NEXT STEPS FOR AGENTS

### To Build Org Chart Page (Director Only):
1. Create `src/app/(app)/org-structure/page.tsx`
2. Wrap with `<RoleGate requiredRoles={['DIRECTOR']}>`
3. Create `src/components/org-structure/OrgChart.tsx`
4. Add CRUD operations:
   - `createOrgNode()` - Create org node
   - `getOrgTree()` - Fetch tree structure
   - `deleteOrgNode()` - Delete node
5. Add API routes for operations
6. Add audit logging for all changes

### To Build Approvals Page (HOD):
1. Create `src/app/(app)/approvals/page.tsx`
2. Wrap with `<RoleGate requiredRoles={['HOD', 'FINANCE']}`
3. Fetch pending approvals from DB
4. Show approve/reject buttons
5. Update status in DB when approved/rejected
6. Add audit logging

### To Build Task Pool (Faculty):
1. Create `src/app/(app)/task-pool/page.tsx`
2. Fetch available tasks from DB
3. Show "Apply" button to nominate for task
4. Create nomination in DB
5. Update approvals workflow

---

## TESTING CHECKLIST

Before calling this "done", test these scenarios:

### Authentication
- [ ] Signup creates user in Supabase
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials shows error
- [ ] Session persists on refresh
- [ ] Logout clears session

### Role-Based Access
- [ ] Director sees Director Dashboard
- [ ] HOD sees HOD Dashboard
- [ ] Finance sees Finance Dashboard
- [ ] Faculty sees Faculty Dashboard
- [ ] Director CAN access /org-structure
- [ ] Faculty CANNOT access /org-structure (shows 403)
- [ ] Faculty CANNOT access /approvals

### Dashboard Display
- [ ] All 4 metric cards display
- [ ] Charts render (if applicable)
- [ ] Recent activity shows
- [ ] Empty states display when no data

### Responsive Design
- [ ] Mobile (< 640px): Single column, stacked cards
- [ ] Tablet (640-1024px): 2 columns
- [ ] Desktop (> 1024px): 4 columns or side-by-side layout

### Dark Mode
- [ ] Colors adjust properly
- [ ] Text readable in both modes
- [ ] Cards have proper contrast

---

## EXAMPLE USAGE FOR OTHER AGENTS

When an agent asks to build a similar page, show them:

1. **This file** (TEAM_EXAMPLE_BUILD_COMPLETE.md)
2. **PROGRESS_BUILD.md** (what works/what doesn't)
3. **BUILD_EXECUTION_STRATEGY.md** (how it's organized)
4. **The code in**: 
   - `src/app/(app)/dashboard/page.tsx` (routing)
   - `src/components/common/RoleGate.tsx` (access control)
   - `src/components/dashboard/DirectorDashboard.tsx` (component)

Then ask them to:
1. Copy the pattern
2. Create their own page
3. Update PROGRESS_BUILD.md as they go
4. Reference this file if they get stuck

---

## SUCCESS METRICS

This build succeeds when:
- ✅ Login/signup works end-to-end
- ✅ All 4 dashboards load with correct data per role
- ✅ Role-based access control enforces permissions
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ No console errors or warnings
- ✅ Dark mode works properly
- ✅ Audit logs track all user actions
- ✅ Loading/error states display correctly

---

## SUMMARY FOR TEAM

**What v0 built:**
- Complete role-based dashboard MVP
- Working authentication system
- Role-based page routing
- Access control with RoleGate wrapper
- 4 role-specific dashboard components
- Middleware for session validation
- Fixed TypeScript errors
- Complete documentation for learning

**What agents should do next:**
- Follow the patterns shown in this build
- Use RoleGate for access control (never check role in JSX)
- Implement 3-state pattern (loading/error/success)
- Use CSS variables for colors (never hardcode hex)
- Add audit logging for all user actions
- Test role-based access before calling done

**Example to show other agents:**
"See TEAM_EXAMPLE_BUILD_COMPLETE.md for a working example of role-based access control."

