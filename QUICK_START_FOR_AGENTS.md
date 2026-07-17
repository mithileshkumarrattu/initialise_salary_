# Quick Start Guide for v0 Agents

**READ THIS FIRST** - 5 minute orientation

## What Is WorkToken?

Token-based work attribution system for colleges. Faculty earn "tokens" for tasks, can initiate salary transfers. 5 roles with different dashboards and permissions.

## Status Summary

- ✅ **DONE**: Sidebar role-based menus
- ✅ **DONE**: useRole hook now fetches from DB
- ✅ **DONE**: Core infrastructure fixed
- ⏳ **NEXT**: Build Admin Dashboard (Phase 2)
- ⏳ **NEXT**: Build Faculty Dashboard (Phase 3)
- ⏳ **NEXT**: Build HOD, Director, Finance dashboards (Phases 4-6)

## Files You Need (In Reading Order)

1. **MASTER_ARCHITECTURE_GUIDE.md** (THIS IS YOUR BIBLE - 570 lines)
   - Complete spec for all 5 roles
   - Every component specified in detail
   - Database mapping
   - Implementation priority

2. **CONTEXT_TRANSFER_PROMPT_FOR_NEW_THREADS.md** (For new threads)
   - Copy+paste to continue in new thread
   - Has all critical context
   - Testing checklist

3. **This file** (Quick start)
   - 5-minute overview
   - What to build next

## 5 Roles at a Glance

| Role | Sidebar | Key Actions | Dashboard Focus |
|------|---------|------------|-----------------|
| **Admin** | Dashboard, Settings, Audit | Create users/depts, edit rates | Org tree, user CRUD, audit log |
| **Director** | Dashboard only | Approve loans, view KPIs | Token metrics, dept heatmap |
| **HOD** | Dashboard, My Work, Task Pool, Approvals, Team, Settings | Create/assign tasks, approve attendance/salary | Personal progress + management tabs |
| **Faculty** | Dashboard, My Work, Task Pool | Mark attendance, nominate for tasks, submit proofs | Personal progress, active commitments |
| **Finance** | Dashboard, Finance, Approvals, Audit | View transactions, trigger batch reversal | Token KPIs, transaction log |

## Your Next Task (Phase 2)

### Build Admin Dashboard

**Files to create/edit**:

1. Create `src/lib/db/queries/admin.ts`
   - `getOrgStructure(orgId)` - fetch orgs + depts + HODs
   - `getAllUsers(orgId)` - fetch all users with filters
   - `createUser(data)` - insert user
   - `updateUser(userId, data)` - update user
   - `getRateCards(orgId)` - fetch rate_cards
   - `createRateCard(data)` - insert rate_card
   - `getAuditLogs(filters)` - fetch audit_logs (immutable view)

2. Create `src/components/admin/AdminDashboard.tsx`
   - Import 5 sub-components
   - Render them (loading state, error handling)

3. Create `src/components/admin/OrgTreeBuilder.tsx`
   - Shows org hierarchy as tree
   - Buttons: + Create Dept, Edit, Delete
   - On create/edit/delete: call queries, log to audit_logs

4. Create `src/components/admin/UserManagementTable.tsx`
   - Table: all users with columns (name, email, dept, role, status)
   - Filters: search by email, filter by dept/role
   - Actions: Edit (opens modal), Deactivate (soft delete)
   - Bulk import: CSV upload button

5. Create `src/components/admin/RateCardEditor.tsx`
   - Table: all rate_cards (task_type, tokens_per_hour, role_multipliers)
   - Create new: button → form modal
   - Edit: inline edit on table
   - Version history: shows all past versions

6. Create `src/components/admin/BlockchainConfig.tsx`
   - Two input fields: contract_address, rpc_endpoint
   - Save button → updates settings
   - Test Connection button → validates blockchain

7. Create `src/components/admin/AuditLogViewer.tsx`
   - Table: all audit_logs (actor, action, entity, before/after, timestamp)
   - Filters: date range, actor, action
   - Export: CSV download button
   - Read-only (no edit/delete)

4. Update `src/app/(app)/dashboard/page.tsx`
   - Check: if role='admin', render AdminDashboard
   - Pass profile data to component

## Building Pattern (Repeat for each role)

**Step 1**: Read the role spec in MASTER_ARCHITECTURE_GUIDE.md Section 1

**Step 2**: Create query file with all queries listed

**Step 3**: Create main dashboard component (load queries, handle states)

**Step 4**: Create each sub-component (receives data, renders UI)

**Step 5**: Update dashboard page.tsx to check role

**Step 6**: Test
- Log in as that role
- Verify dashboard loads
- Test each button/form
- Check DB for audit_logs entries
- Check for errors

## Code Patterns To Follow

### Query Files
```typescript
// src/lib/db/queries/admin.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function getOrgStructure(orgId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, departments(id, name, hod_id)')
    .eq('id', orgId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
```

### Main Dashboard
```typescript
// src/components/admin/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { getOrgStructure } from '@/lib/db/queries/admin';

export default function AdminDashboard({ profile }) {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setState('loading');
      const orgData = await getOrgStructure(profile.organization_id);
      setData(orgData);
      setState('success');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  if (state === 'loading') return <LoadingState />;
  if (state === 'error') return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <OrgTreeBuilder orgData={data} />
      <UserManagementTable orgId={profile.organization_id} />
      <RateCardEditor orgId={profile.organization_id} />
      <BlockchainConfig />
      <AuditLogViewer orgId={profile.organization_id} />
    </div>
  );
}
```

## Testing Before Moving To Next Phase

- [ ] Admin can login
- [ ] Sidebar shows: Dashboard, Settings, Audit Log only
- [ ] Dashboard loads without errors
- [ ] OrgTreeBuilder renders org hierarchy
- [ ] Can create new department (appears in tree, audit_logs entry created)
- [ ] UserManagementTable shows all users
- [ ] Can edit user (updates DB, audit_logs entry created)
- [ ] RateCardEditor shows all rate_cards
- [ ] Can create new rate card (appears in table)
- [ ] AuditLogViewer shows all actions (no edit/delete buttons)
- [ ] Every action creates audit_logs entry
- [ ] Loading/error states work
- [ ] Mobile responsive
- [ ] No console errors

## Common Mistakes To Avoid

❌ Hardcoding role checks in components (use RoleGate wrapper instead)
❌ Fetching in useEffect (use Server Components instead)
❌ Hardcoded colors like `bg-[#8F7AFF]` (use `bg-primary` CSS variables)
❌ Skipping audit_logs entries (every action must log)
❌ Filtering data in component (filter at query level)
❌ Using mock data (query real Supabase)
❌ Forgetting three-state pattern (loading/error/success)
❌ Not handling empty data (show empty state)

## Emergency Commands

```bash
# Check what's in DB (if connection works)
npx supabase query

# View logs
npm run dev  # Watch terminal for errors

# Reset auth
# Delete cookies + localStorage in browser DevTools
```

## Files To Avoid Touching (Unless Fixing Bugs)

- `src/middleware.ts` - Session validation (working)
- `src/app/(app)/layout.tsx` - Sidebar integration (working)
- `src/lib/hooks/useRole.ts` - Role fetching (fixed)
- `src/components/layout/AppSidebar.tsx` - Role-based menus (fixed)

## Questions?

**If confused**: Read MASTER_ARCHITECTURE_GUIDE.md - answer is there.
**If stuck**: Check Phase 2 instructions in MASTER_ARCHITECTURE_GUIDE.md Section 7.
**If error**: Check the Testing Checklist (Section 10) - covers most issues.

---

## Next Thread? Paste This

When thread gets long, paste `CONTEXT_TRANSFER_PROMPT_FOR_NEW_THREADS.md` into new thread. It has all context needed.

---

**Ready to build Phase 2? Start with reading MASTER_ARCHITECTURE_GUIDE.md Section 1.1 (Admin role) completely, then create admin query file.**

