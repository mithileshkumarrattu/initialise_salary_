# REHABILITATION PROMPT FOR OLD AGENT

**Copy this entire prompt and give it to your old agent to restart context correctly.**

---

## ⚠️ YOU HALLUCINATED. HERE'S WHAT WENT WRONG.

You were building WorkToken but:

1. **You didn't understand the problem** - You thought it was a payment system. It's actually about **making invisible work visible through immutable token accounting**.

2. **You didn't read the spec fully** - You skipped the complete architecture document and created random pages without understanding why they exist.

3. **You mixed mock data everywhere** - This is a CRITICAL violation. There's never supposed to be mock data. All data comes from the database.

4. **You guessed at the structure** - You created separate routes for each role instead of understanding that there's ONE `/dashboard` route that detects the role and renders appropriately.

5. **You got confused on blockchain** - Started with blockchain, then gave up, then tried again. You need to understand: blockchain is ONLY used for salary transfer immutability, not everything.

---

## 🎯 HERE'S WHAT YOU NEED TO DO NOW

### Step 1: Erase Your Context (5 minutes)

Forget everything you "remember" about this project. Ignore any previous code you wrote that mixed mock data or created multiple dashboards. **We're starting fresh with correct architecture.**

### Step 2: Read the Ground Truth (2.5 hours)

Read these documents **IN THIS ORDER**:

1. **MASTER_PROMPT_FOR_AGENTS.md** - 30 minutes
   - Focus on: "What We're Building" section
   - Focus on: "Golden Rules" section
   - Focus on: "The Complete Page Map" section
   - Focus on: "State Diagram - Faculty Journey"

2. **DESIGN_SYSTEM_SETUP.md** - 20 minutes
   - Learn: Colors (exact hex values)
   - Learn: Typography (sizes, weights)
   - Learn: Spacing (8px grid)

3. **SYSTEM_DIAGRAMS.md** - 30 minutes
   - Study: Class diagram (data model)
   - Study: State diagram (faculty workflow)
   - Study: Sequence diagrams (approval chains)

4. **implementation_plan.md** - 1 hour
   - Learn: Complete database schema
   - Learn: All query functions
   - Learn: All API endpoints

5. **AGENT_QUICK_REFERENCE.md** - 10 minutes
   - Reference: Golden rules checklist
   - Reference: Design tokens copy-paste
   - Reference: Query layer functions

### Step 3: Understand What Went Wrong (15 minutes)

Read this file in its entirety. When you see **CRITICAL MISTAKE #X**, understand exactly why it's wrong and how to avoid it.

### Step 4: Review Specific Sections (20 minutes)

Before writing ANY code, reread these specific sections:

- **MASTER_PROMPT_FOR_AGENTS.md** → "Why Previous Agent Hallucinated"
- **AGENT_QUICK_REFERENCE.md** → "COMMON MISTAKES (Avoid These)"
- **MASTER_PROMPT_FOR_AGENTS.md** → "THE ABSOLUTE GROUND TRUTH"

### Step 5: Start Building (After Reading Everything)

**NOT BEFORE.** Don't code until you've read all the documents above.

---

## 🚨 CRITICAL MISTAKES YOU MADE (Don't Repeat These)

### CRITICAL MISTAKE #1: Mock Data Everywhere

**What you did wrong:**
```tsx
const mockTasks = [
  { id: '1', title: 'Task 1', status: 'completed' },
  { id: '2', title: 'Task 2', status: 'pending' },
];

function TaskList() {
  return (
    <div>
      {mockTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

**Why it's wrong:**
- The golden rule is ZERO mock data
- The system needs immutable proof of work
- Mock data invalidates the entire purpose
- Violates audit trail requirement

**What to do instead:**
```tsx
function TaskList() {
  const { data: tasks, loading, error } = useQuery(getMyNominations);
  
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback onRetry={...} />;
  if (tasks.length === 0) return <EmptyState title="No nominations" />;
  
  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

**Key difference:**
- Uses `getMyNominations()` query function (not mock data)
- Shows LoadingSkeleton while loading
- Shows ErrorFallback if error occurs
- Shows EmptyState if no data (not blank page)
- Only renders real data

### CRITICAL MISTAKE #2: Skipped Loading/Error/Empty States

**What you did wrong:**
```tsx
function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    getOrgStats().then(setData);
  }, []);
  
  // MISTAKE: No loading state, no error handling, no empty state
  return <div>{data?.progress}</div>;
}
```

**What happens:**
- Page appears blank while loading (bad UX)
- If error occurs, nothing shows (broken page)
- User thinks page is broken

**What to do instead:**
```tsx
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const result = await getOrgStats();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);
  
  // Three states: always
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback error={error} onRetry={/* refetch */} />;
  if (!data) return <EmptyState title="No data" />;
  
  return <div>{data.progress}</div>;
}
```

**Why this matters:**
- Loading skeleton shows user "something is happening"
- Error fallback lets user retry if it failed
- Empty state is better than blank page
- Three-state pattern is MANDATORY

### CRITICAL MISTAKE #3: Role Check in JSX

**What you did wrong:**
```tsx
// ❌ WRONG
function ApprovalPanel() {
  const user = useAuth();
  
  return (
    <>
      {user.role === 'HOD' && <HodApprovals />}
      {user.role === 'FINANCE' && <FinanceApprovals />}
      {user.role !== 'HOD' && user.role !== 'FINANCE' && (
        <div>You don't have permission</div>
      )}
    </>
  );
}
```

**Why it's wrong:**
- Exposes component logic in JSX
- Hard to refactor
- Hard to test
- Not consistent with rest of codebase

**What to do instead:**
```tsx
// ✅ CORRECT - Use RoleGate wrapper
function ApprovalPanel() {
  return (
    <RoleGate requiredPermission="APPROVE_TASKS">
      <ApprovalContent />
    </RoleGate>
  );
}

// RoleGate component handles the check
function RoleGate({ requiredPermission, children }) {
  const user = useAuth();
  
  if (!user.hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }
  
  return children;
}
```

**Why this is better:**
- Separation of concerns
- Reusable across all pages
- Consistent permission handling
- Easy to audit and modify

### CRITICAL MISTAKE #4: Multiple Dashboards Instead of Role Detection

**What you did wrong:**
```tsx
// ❌ WRONG - Created separate routes
/app/faculty-dashboard/page.tsx
/app/hod-dashboard/page.tsx
/app/director-dashboard/page.tsx
/app/finance-dashboard/page.tsx

// User has to navigate to the right URL
// Confusing, fragile, non-standard
```

**Why it's wrong:**
- Each role doesn't know their dashboard URL
- Hard to test all paths
- Violates single entry point principle
- Non-standard Next.js pattern

**What to do instead:**
```tsx
// ✅ CORRECT - Single route with role detection
/app/dashboard/page.tsx

export default function DashboardPage() {
  const user = useAuth();
  
  // Role detection at single entry point
  if (user.role === 'FACULTY') return <FacultyDashboard />;
  if (user.role === 'HOD') return <HodDashboard />;
  if (user.role === 'DIRECTOR') return <DirectorDashboard />;
  if (user.role === 'FINANCE') return <FinanceDashboard />;
  
  return <AccessDenied />;
}
```

**Why this is correct:**
- Single landing point for all roles
- Role detection is centralized
- User always goes to `/dashboard`
- Easy to maintain and test

### CRITICAL MISTAKE #5: Hardcoded Colors

**What you did wrong:**
```tsx
// ❌ WRONG - Hardcoded hex values
<div className="bg-[#817AFF] text-[#F2E030] p-4">
  Success
</div>

<button className="bg-[#844A87] hover:bg-[#FFC30C]">
  Click me
</button>
```

**Why it's wrong:**
- Color changes require finding all instances
- Violates DRY principle (Don't Repeat Yourself)
- Can't enforce design consistency
- Makes design tokens useless

**What to do instead:**
```tsx
// ✅ CORRECT - Use CSS tokens
<div className="bg-primary text-foreground-dark p-4">
  Success
</div>

<button className="bg-secondary hover:bg-warning">
  Click me
</button>

// Colors defined in globals.css as tokens:
// @theme inline {
//   --color-primary: #817AFF;
//   --color-secondary: #844A87;
//   --color-warning: #FFC30C;
//   --color-foreground-dark: #F2E030;
// }
```

**Why this is better:**
- One place to define colors
- Easy to change design system globally
- Enforces consistency
- Team can't accidentally use wrong colors

### CRITICAL MISTAKE #6: Not Using Query Layer Functions

**What you did wrong:**
```tsx
// ❌ WRONG - Direct database access
async function getTasksForFaculty(userId) {
  const { data } = await supabase
    .from('unstructured_tasks')
    .select('*')
    .eq('faculty_id', userId);
  return data;
}

// And calling it everywhere:
const tasks = await supabase.from('unstructured_tasks').select('*');
```

**Why it's wrong:**
- Database queries scattered everywhere
- Hard to update query logic (need to find all instances)
- No centralized business logic
- Can't implement caching/optimization globally
- Query optimization requires touching many files

**What to do instead:**
```tsx
// ✅ CORRECT - Query layer centralization

// /lib/db/queries/unstructured-tasks.ts
export async function getMyNominations(userId: string) {
  const { data, error } = await supabase
    .from('task_nominations')
    .select('*, unstructured_tasks(*)')
    .eq('faculty_id', userId)
    .order('nominated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// In components: just call the function
const nominations = await getMyNominations(userId);
```

**Why this is better:**
- Single source of truth for queries
- Easy to add caching/optimization
- Easy to debug (one place to add logging)
- Easy to update query (one place to change)
- Enforces consistent error handling

### CRITICAL MISTAKE #7: Missing Immutable Audit Trail

**What you did wrong:**
```tsx
// ❌ WRONG - No audit trail
function ApproveSalary({ transferId }) {
  async function approve() {
    // Just update the status
    await supabase
      .from('salary_transfers')
      .update({ status: 'APPROVED' })
      .eq('id', transferId);
  }
}
```

**Why it's wrong:**
- No proof of who approved and when
- Can't audit for compliance
- Can't prove salary was earned
- Violates immutability requirement
- Blockchain integration missing

**What to do instead:**
```tsx
// ✅ CORRECT - Immutable audit trail

async function approveSalary(transferId, userId) {
  // 1. Update salary transfer status
  const { data: transfer } = await supabase
    .from('salary_transfers')
    .update({
      status: 'FINANCE_APPROVED',
      finance_approved_by: userId,
      finance_approval_at: new Date(),
    })
    .eq('id', transferId)
    .single();
  
  // 2. Create immutable audit log
  await supabase
    .from('audit_logs')
    .insert({
      action: 'SALARY_APPROVED',
      entity_type: 'salary_transfer',
      entity_id: transferId,
      actor_id: userId,
      changes: {
        status_before: 'HOD_APPROVED',
        status_after: 'FINANCE_APPROVED',
      },
      timestamp: new Date(),
      ip_address: getClientIP(), // For security tracking
    });
  
  // 3. Execute blockchain transfer
  const tx = await executeSmartContract(transfer.amount_tokens, facultyWallet);
  
  // 4. Record blockchain proof
  await supabase
    .from('salary_transfers')
    .update({ tx_hash: tx.hash })
    .eq('id', transferId);
  
  return tx;
}
```

**Why this is correct:**
- Audit log shows who did what and when
- Blockchain tx_hash is immutable proof
- Can be verified by external auditors
- Complies with audit trail requirements

---

## 🎬 RESTART SEQUENCE (Do This Now)

### Step 1: **Read All Docs** (2.5 hours)
Read the 5 documents in order (MASTER_PROMPT, DESIGN_SYSTEM, SYSTEM_DIAGRAMS, QUICK_REFERENCE, implementation_plan).

### Step 2: **Erase Mock Data**
Find all mock data in your code. Delete it completely. Replace with database queries via query layer.

### Step 3: **Implement Three-State Pattern**
Find all components that fetch data. Add loading/error/empty states to every single one.

### Step 4: **Replace Role Checks**
Find all `if (user.role === 'X')` in JSX. Replace with `<RoleGate>` wrapper.

### Step 5: **Consolidate Routes**
Combine all role-specific dashboards into single `/dashboard` route with role detection.

### Step 6: **Use CSS Tokens**
Find all hardcoded colors. Replace with token variables (bg-primary, text-foreground-dark, etc).

### Step 7: **Use Query Layer**
Find all direct database access. Move to lib/db/queries/ functions.

### Step 8: **Add Audit Trail**
Find all state updates. Add corresponding audit_logs inserts for immutability.

### Step 9: **Integrate Blockchain**
Find all salary transfer logic. Add smart contract calls and tx_hash recording.

### Step 10: **Test Everything**
- Test loading state (add 2s delay to query)
- Test error state (throw error from query)
- Test empty state (mock empty array)
- Test success path (normal operation)

---

## ✅ VERIFICATION CHECKLIST

Before claiming you're "fixed," verify:

```
□ ZERO mock data in any component
□ Every async component has three states (loading/error/success)
□ Every role restriction uses <RoleGate> wrapper
□ Single /dashboard route with role detection
□ All colors use CSS tokens (bg-primary, etc)
□ ALL database access through lib/db/queries/ ONLY
□ Every state change logged in audit_logs table
□ Salary transfers include blockchain tx_hash
□ No hardcoded colors
□ No hardcoded margins/padding (use spacing tokens)
□ No role checks in JSX (only in RoleGate)
□ No direct supabase.from() in components
```

If ANY of these are false, you're still hallucinating. Fix it.

---

## 📚 YOUR NEW COMMANDMENTS

Going forward, when building ANY feature:

1. **Read the spec first** - Don't guess. The specification exists for a reason.
2. **Use query functions** - Never write supabase.from() in components.
3. **Implement three states** - Every async operation: loading, error, success.
4. **Use RoleGate** - Every restricted feature gets wrapped.
5. **Use tokens** - Every color/spacing uses design system tokens.
6. **Log everything** - Every state change gets audit log.
7. **Verify on blockchain** - Every salary action gets tx_hash.
8. **Test all states** - Don't just test the happy path.

**Follow these rules exactly and you will build correctly.**

---

## 🚀 YOU'RE READY

You've been given:
- Complete architectural specification
- Design system with exact tokens
- Database schema with all fields
- Page map with requirements
- UML diagrams showing workflows
- Query layer with centralized access
- Golden rules to prevent hallucination

**There is no excuse for hallucination now.**

Read everything. Follow exactly. Build correctly.

**The project succeeds or fails based on your adherence to these documents.**

No creativity. No interpretations. No guesses.

**Just follow the spec and code will be right.**

---

**Status**: Ready for Restart
**Time Needed**: 2.5 hours reading + 4-6 hours rebuilding
**Success Criteria**: All 10 verification checklist items pass
**Next Step**: Read MASTER_PROMPT_FOR_AGENTS.md for 30 minutes RIGHT NOW
