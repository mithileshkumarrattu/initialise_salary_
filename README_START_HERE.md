# 🚀 WorkToken Platform - START HERE

**You have 6 comprehensive documents ready. Read them in order.**

---

## What's in This Project?

WorkToken is a **token-based work accounting system** for educational institutions (colleges) that:

- **Makes all work visible** - Teaching, mentoring, event organization tracked
- **Ties compensation to verified output** - Salary released only when faculty reaches 85% progress
- **Uses blockchain for immutability** - Every transaction permanently recorded
- **Implements role-based workflows** - Director → HOD → Faculty → Finance

---

## The Problem It Solves

Traditional salary systems are opaque:
- ❌ "Did I do enough work to deserve my full salary?"
- ❌ "How much of my compensation is from teaching vs other work?"
- ❌ "Where did my approval get stuck?"
- ❌ "Prove to auditors that this salary was earned."

WorkToken answers all of this with immutable records.

---

## Project Structure

```
THIS CODEBASE
├── MASTER_PROMPT_FOR_AGENTS.md      ← Read 1st (30 min)
├── DESIGN_SYSTEM_SETUP.md           ← Read 2nd (20 min)
├── implementation_plan.md            ← Read 3rd (1 hour)
├── SYSTEM_DIAGRAMS.md               ← Read 4th (30 min)
├── PAGE_BUILDING_TEMPLATE.md        ← Read 5th (20 min)
├── AGENT_QUICK_REFERENCE.md         ← Read 6th (10 min)
├── README_START_HERE.md             ← You are here
├── /app                             ← Next.js application
├── /components                      ← React components
├── /lib/db/queries                  ← Query layer (data centralization)
└── /public/fonts                    ← One UI Sans font
```

---

## For Different People

### 🤖 AI Agents (Builders)
1. Read **MASTER_PROMPT_FOR_AGENTS.md** - Understand the project
2. Read **DESIGN_SYSTEM_SETUP.md** - Learn styling rules
3. Read **SYSTEM_DIAGRAMS.md** - Understand architecture
4. Reference **AGENT_QUICK_REFERENCE.md** while building
5. Use **PAGE_BUILDING_TEMPLATE.md** when assigned a page

### 👥 Team Members (Adding Pages)
1. Read **MASTER_PROMPT_FOR_AGENTS.md** (focus on page map section)
2. Read **PAGE_BUILDING_TEMPLATE.md** (fill in your page details)
3. Give filled template to AI agent
4. Reference **AGENT_QUICK_REFERENCE.md** during development

### 📋 Project Managers
1. Read **MASTER_PROMPT_FOR_AGENTS.md** (focus on complete page map)
2. Skim **SYSTEM_DIAGRAMS.md** (understand workflow)
3. Reference **implementation_plan.md** for database schema

### 🎯 Code Reviewers
1. Use **AGENT_QUICK_REFERENCE.md** (golden rules to check)
2. Reference **DESIGN_SYSTEM_SETUP.md** (verify colors/typography)
3. Check **SYSTEM_DIAGRAMS.md** (verify workflow correctness)

---

## The Three-State Pattern (Most Important)

Every component that fetches data uses THIS pattern:

```tsx
if (loading) return <LoadingSkeleton />;
if (error) return <ErrorFallback onRetry={...} />;
if (empty) return <EmptyState />;
return <ActualComponent />;
```

**NEVER skip states. NEVER show mock data. NEVER show blank page.**

---

## The Golden Rules

These are **non-negotiable**. Every hallucination breaks one of these:

1. **ZERO Mock Data** - All data from database via query functions
2. **Three States Always** - Loading → Error → Success for every async operation
3. **Query Layer Only** - Database access ONLY through lib/db/queries/
4. **RoleGate Wrapper** - Restricted features wrapped in <RoleGate>
5. **CSS Tokens Only** - Use `bg-primary`, never `#817AFF`
6. **Type Safe** - TypeScript everywhere, no `any`
7. **Audit Immutable** - Every transaction logged for verification

---

## The Role-Based Workflow

```
DIRECTOR (1 person)
  └─ Mints total salary budget as tokens
    
HOD (Department Heads, 10 per college)
  ├─ Posts tasks for faculty
  ├─ Approves faculty work
  └─ Approves salary transfers
    
FACULTY (Teachers, 200-500 per college)
  ├─ Teaches scheduled classes
  ├─ Nominates for additional tasks
  ├─ Proves task completion
  └─ Initiates salary transfer when >= 85% progress
    
FINANCE (2-3 people)
  ├─ Reviews all transfers
  ├─ Verifies balances
  └─ Triggers smart contract to release salary
```

---

## Design System (One UI)

**Colors**:
- Primary: `#817AFF` (purple for actions)
- Success: `#00C853` (green for approved)
- Warning: `#FFC30C` (yellow for pending)
- Error: `#FF3B30` (red for rejected)

**Typography**:
- Title: 36px, 700 Bold
- Heading: 24px, 600 Semibold
- Body: 14px, 400 Regular
- Font: Variable One UI Sans (custom)

**Spacing**:
- Base: 8px grid
- Default gaps: 16px (gap-4)
- Card padding: 24px (p-6)

**No creative freedom. Exact specification required.**

---

## The Page Map

Every page is documented with:
- Route
- Purpose
- Components needed
- Database queries required
- User flow
- Design specifications

See **MASTER_PROMPT_FOR_AGENTS.md** section "THE COMPLETE PAGE MAP"

---

## Dual Templates (Future Feature)

Same codebase supports TWO organizational structures:

**Template 1: College-Specific** (Active now)
- Director, HODs, Faculty, Finance
- Structured work: Classes on timetable
- Unstructured work: Events, mentoring

**Template 2: Enterprise** (Phase 3)
- CEO, Department Managers, Employees, Finance
- Structured work: Project assignments
- Unstructured work: Mentoring, knowledge sessions

Routes:
- `/college/*` - College views
- `/enterprise/*` - Enterprise views
- Single `/dashboard` detects org type automatically

---

## Getting Started (First 30 Minutes)

### For New Agents:
```
1. Read MASTER_PROMPT_FOR_AGENTS.md (30 min)
   └─ Understand: The problem, the solution, the golden rules
   
2. Read AGENT_QUICK_REFERENCE.md (10 min)
   └─ Reference: Design tokens, file structure, query layer
   
3. You're ready to code
   └─ Use PAGE_BUILDING_TEMPLATE.md for guidance on specific pages
```

### For Team Members Building a Page:
```
1. Read PAGE_BUILDING_TEMPLATE.md (20 min)
2. Fill in YOUR page details (30 min)
3. Give to AI agent with this template (5 min)
4. AI builds it following the spec (30 min+)
```

---

## Database Setup

The database has been pre-configured with these tables:

```
users                 - Roles, progress, token balance
departments           - Organization structure
structured_tasks      - Scheduled classes
unstructured_tasks    - Events, mentoring, projects
task_nominations      - Faculty applications for tasks
tokens                - Balance tracking
salary_transfers      - Approval workflow
audit_logs            - Immutable transaction log
```

See **implementation_plan.md** for complete schema with all fields.

---

## Key Concepts

### Progress Percentage (THE CORE METRIC)

```
Total Progress % = (Structured % × 0.7) + (Unstructured % × 0.3)

Structured %:
  = Classes attended / Total classes assigned
  = Automatically tracked from attendance

Unstructured %:
  = Tasks completed / Available tasks in department
  = Requires HOD approval of proof

Target: 85% (Faculty can initiate salary transfer when >= 85%)
```

### Token System

- Director mints N tokens = total annual salary budget
- Tokens distributed based on verified work completion
- Faculty receives tokens (not fiat salary) during semester
- At end of semester: Finance releases fiat salary based on token balance
- All transfers immutably recorded on blockchain

### Approval Chain

```
Faculty completes work → Provides proof → HOD reviews → Approves
Salary transfer initiated → HOD approves → Finance approves → Smart contract executes
Transaction recorded on blockchain (immutable)
Fiat salary released to faculty bank account
```

---

## Next Steps

1. **Understand the system** (2.5 hours reading)
   - Read the 6 documents above

2. **Set up environment** (15 minutes)
   - Copy font file to `/public/fonts/`
   - Ensure design tokens in `globals.css` (provided)
   - Verify database connected

3. **Start building** (depends on assigned page)
   - Use PAGE_BUILDING_TEMPLATE.md
   - Follow AGENT_QUICK_REFERENCE.md
   - Reference SYSTEM_DIAGRAMS.md when confused

---

## Common Questions Answered

**Q: Why so many documents?**
A: Specificity prevents hallucination. One vague spec = wrong code. Six detailed docs = correct code.

**Q: Can I deviate from the spec?**
A: No. These rules exist because previous attempts broke them. Follow exactly.

**Q: What if I find a better way to do something?**
A: Document it in this README. Once approved, update the relevant spec doc so everyone follows it.

**Q: Can we use different colors?**
A: No. One UI spec is final. Colors are consistent across the entire app.

**Q: What if I don't understand something?**
A: Read the docs again (more carefully). If still confused, ask in the team chat with specific question.

---

## File Locations Quick Map

```
Design System:              DESIGN_SYSTEM_SETUP.md
Architecture:               SYSTEM_DIAGRAMS.md
Database Schema:            implementation_plan.md
Page Structure:             MASTER_PROMPT_FOR_AGENTS.md → THE COMPLETE PAGE MAP
Debugging Tips:             AGENT_QUICK_REFERENCE.md → DEBUGGING CHECKLIST
Page Building Guide:        PAGE_BUILDING_TEMPLATE.md

Code Files:
  Pages:                    /app/[route]/page.tsx
  Components:               /components/[feature]/
  Queries:                  /lib/db/queries/
  Types:                    /types/index.ts
  Styles:                   /app/globals.css
  Fonts:                    /public/fonts/
```

---

## Success Metrics (Project is Done When)

```
✅ All pages built according to spec
✅ All pages load with real data (no mock)
✅ All pages handle three states (loading/error/success)
✅ All pages follow design system (colors/typography/spacing)
✅ All roles have complete workflows (login → dashboard → action → approval)
✅ All approval flows work (faculty → HOD → finance → blockchain)
✅ All data immutably recorded (audit trail complete)
✅ All tests pass (if TDD enabled)
✅ No console errors or warnings
✅ Accessible (WCAG AA standards)
✅ Mobile responsive (320px, 768px, 1024px)
```

---

## Support

**Stuck on something?**
1. Check AGENT_QUICK_REFERENCE.md first
2. Check relevant section in MASTER_PROMPT_FOR_AGENTS.md
3. Ask in team chat with:
   - What you're trying to do
   - What error you're seeing
   - Which document you've read

---

## Version History

**v1.0** - July 8, 2026
- Complete system specification
- Design system documented
- Page map defined
- UML diagrams created
- Team prompt templates created

---

## CRITICAL REMINDER

**Before writing ANY code:**

1. ✅ Read MASTER_PROMPT_FOR_AGENTS.md completely
2. ✅ Read DESIGN_SYSTEM_SETUP.md completely
3. ✅ Understand the three-state pattern
4. ✅ Understand the golden rules

**The order matters. The completeness matters. Skipping steps = hallucination.**

---

**You have everything you need. Read it all. Build it right. Ship it with confidence.**

---

**Last Updated**: July 8, 2026
**Status**: Production Ready
**Approved For**: Immediate Development Start

**Questions? Read the docs first. Almost every answer is already there.**
