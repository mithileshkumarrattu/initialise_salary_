# PAGE BUILDING TEMPLATE - For Team Members

**Use this template when assigned a page to build.**

Copy this entire prompt after the main MASTER_PROMPT_FOR_AGENTS.md and paste it to your AI agent.

---

## BEFORE STARTING

1. ✅ Read MASTER_PROMPT_FOR_AGENTS.md completely
2. ✅ Read DESIGN_SYSTEM_SETUP.md for all color/typography/spacing
3. ✅ Read implementation_plan.md to understand the database schema
4. ✅ Understand the three-state pattern (Loading → Error → Success)
5. ✅ Know the query layer functions in lib/db/queries/

---

## PAGE ASSIGNMENT TEMPLATE

> **Copy the relevant section below for your assigned page and fill in the details**

---

### TASK: Build [PAGE_NAME]

**Route**: `/[route-path]`
**Role Required**: [DIRECTOR/HOD/FACULTY/FINANCE]
**Status**: [NEW/REFACTOR/FIX]

#### Purpose
> What does this page do? Why does it exist? What is the user trying to accomplish?

#### Components Required

```
Component: [ComponentName]
  Purpose: [why does this component exist?]
  Props:
    - prop1: type (description)
    - prop2: type (description)
  States: loading | error | success | empty
  Location: /components/[page-name]/[ComponentName].tsx

Component: [ComponentName]
  Purpose: [why does this component exist?]
  Props:
    - prop1: type (description)
  States: loading | error | success | empty
  Location: /components/[page-name]/[ComponentName].tsx
```

#### Data Requirements

```
Query Function: getFunctionName()
  Purpose: [what data does this fetch?]
  Returns: [Type] (describe structure)
  Error Cases: [what can go wrong?]
  Located In: lib/db/queries/[queries-file].ts

Query Function: getAnotherFunction()
  Purpose: [what data does this fetch?]
  Returns: [Type]
  Error Cases:
  Located In: lib/db/queries/[queries-file].ts
```

#### Backend Tables & Fields

```
Table: [table_name]
  Fields needed:
    - field1: type → Used for: [component or calculation]
    - field2: type → Used for: [component or calculation]
  Example query:
    SELECT field1, field2, field3 FROM table WHERE condition
  Link to schema: See implementation_plan.md → [section name]

Table: [table_name]
  Fields needed:
    - field1: type → Used for: [component or calculation]
  Example query:
  Link to schema:
```

#### Page Layout Structure

```
[Describe the visual hierarchy]

Example for Faculty Dashboard:
  Header Section (sticky)
    ├─ Title: "Dashboard"
    └─ Quick stats bar (3 cards)
  
  Main Content (scrollable)
    ├─ Left Sidebar (30% width, sticky)
    │  ├─ Progress Ring (center)
    │  └─ Token Balance Card
    └─ Right Content (70% width)
       ├─ Today's Schedule Section
       ├─ My Nominations Section
       └─ Action Buttons
```

#### User Flow (Step-by-Step)

```
1. User lands on page
   └─ Query runs (show LoadingSkeleton while loading)
   
2. If data loads successfully
   ├─ Populate components with data
   ├─ Show empty state if no data
   └─ User can interact with page
   
3. If error occurs
   ├─ Show ErrorFallback component
   ├─ Provide "Retry" button
   └─ Log error to console

4. User performs action [e.g., "clicks Approve"]
   ├─ Disable button (show loading spinner)
   ├─ Send request to API
   ├─ On success: refresh data, show success toast
   └─ On error: show error toast, re-enable button
```

#### Design Specifications

```
Typography:
  Page Title: .text-title (36px, 700 Bold)
  Section Headings: .text-heading (24px, 600 Semibold)
  Card Titles: .text-subtitle (20px, 700 Bold)
  Body Text: .text-body (14px, 400 Regular)

Colors:
  Primary Action: bg-primary (#817AFF)
  Disabled State: opacity-50
  Success: bg-success (#00C853)
  Warning: bg-warning (#FFC30C)
  Error: bg-error (#FF3B30)

Spacing:
  Page padding: px-6 py-4 (md:px-8 md:py-6)
  Section gap: gap-8 (between sections)
  Component gap: gap-4 (between cards)
  Card padding: p-6

Radius:
  Cards: rounded-xl
  Buttons: rounded-lg
  Modals: rounded-3xl

Responsive:
  Mobile (default): single column, full width
  Tablet (md:): [describe layout]
  Desktop (lg:): [describe layout]

Shadows:
  Cards: shadow-lg
  Hover Effects: hover:shadow-xl, hover:bg-secondary
```

#### Key Rules for This Page

```
□ ZERO mock data - All data from database via query functions
□ Three states on every async component (Loading → Error → Success)
□ Use RoleGate wrapper for restricted features
□ Use CSS tokens, never hardcoded colors
□ Use type-safe queries from lib/db/queries/
□ Empty state component if no data (not blank page)
□ Error fallback with retry button (not broken page)
□ Mobile-responsive (test on 320px, 768px, 1024px)
□ Accessibility: alt text, ARIA labels, focus states
□ No console errors or warnings
□ Follow naming convention: PascalCase for components
```

#### Success Criteria

```
✅ Page loads with real data (not mock)
✅ Loading state shows while fetching
✅ Error state shows with retry button (test by breaking query)
✅ Empty state shows when no data (test by filtering to zero results)
✅ All buttons/actions work correctly
✅ Data updates reflect immediately (or after refresh)
✅ Mobile responsive at 320px, 768px, 1024px
✅ Colors match One UI spec exactly
✅ Typography matches spec (sizes, weights)
✅ No hardcoded colors or margins
✅ Accessible: tab navigation, screen reader labels, focus visible
```

#### Build Order

```
1. Create page file structure
   /app/[route]/page.tsx
   /components/[page-name]/Component1.tsx
   /components/[page-name]/Component2.tsx

2. Create types if needed
   /types/[entity].ts (if new domain)

3. Ensure query functions exist
   lib/db/queries/[file].ts (verify these exist BEFORE writing components)

4. Build static layout
   - Create page shell with sections
   - Add placeholder content
   - Test responsive design

5. Add data fetching
   - Implement loading state
   - Call query functions
   - Implement error state
   - Implement empty state

6. Add interactivity
   - Wire up buttons to API calls
   - Add success/error toasts
   - Add data refresh

7. Style and polish
   - Verify all colors match spec
   - Verify all typography matches spec
   - Fix responsive issues
   - Add hover states

8. Test and verify
   - Test loading state
   - Test error state
   - Test empty state
   - Test success path
```

#### Debugging Checklist

```
If page is blank:
  ❓ Is RoleGate blocking access? Check role permission
  ❓ Is query function returning data? Add console.log in component
  ❓ Are components rendering? Check browser console for errors

If data doesn't show:
  ❓ Is query running? Check Network tab for API call
  ❓ Is data structure correct? Verify return type matches code
  ❓ Are you iterating? Check map() has key prop

If styling is wrong:
  ❓ Are CSS tokens defined? Check globals.css
  ❓ Are classes applied? Inspect element in DevTools
  ❓ Is dark mode on? Check data-theme attribute
  ❓ Are colors hardcoded? Replace with token variables

If button doesn't work:
  ❓ Is onClick handler attached? Check JSX
  ❓ Is API endpoint correct? Check Network tab
  ❓ Are permissions correct? Check RoleGate wrapper
  ❓ Is error being logged? Check console
```

---

## EXAMPLE: Building Faculty Dashboard

> **This is a complete example to show how to fill out this template**

### TASK: Build Faculty Dashboard

**Route**: `/dashboard` (when role=FACULTY)
**Role Required**: FACULTY
**Status**: NEW

#### Purpose
The Faculty Dashboard is the landing page for faculty members after login. It shows:
- Current progress percentage toward 85% threshold
- Today's schedule of classes
- Pending task nominations
- Token balance
- Button to initiate salary transfer (when progress >= 85%)

Faculty can see at a glance: "Where am I in my work and what do I need to do today?"

#### Components Required

```
Component: ProgressRing
  Purpose: Visual indicator of progress toward 85% threshold
  Props:
    - currentProgress: number (0-100)
    - targetProgress: number (85)
    - isLoading: boolean
  States: loading | error | success
  Location: /components/faculty-dashboard/ProgressRing.tsx

Component: TodayScheduleCard
  Purpose: Show classes scheduled for today with attendance status
  Props:
    - classes: StructuredTask[] (array of today's classes)
    - isLoading: boolean
    - onMarkAttendance: (classId: string) => Promise<void>
  States: loading | error | success | empty
  Location: /components/faculty-dashboard/TodayScheduleCard.tsx

Component: MyNominationsCard
  Purpose: Show tasks user has nominated for and their status
  Props:
    - nominations: TaskNomination[] (array of nominations)
    - isLoading: boolean
  States: loading | error | success | empty
  Location: /components/faculty-dashboard/MyNominationsCard.tsx

Component: TokenBalanceWidget
  Purpose: Display current token balance and loan status
  Props:
    - balance: number
    - loanBalance: number | null
    - isLoading: boolean
  States: loading | success
  Location: /components/faculty-dashboard/TokenBalanceWidget.tsx

Component: InitiateSalaryButton
  Purpose: Button to start salary transfer process (only shown if progress >= 85%)
  Props:
    - progress: number
    - onClick: () => Promise<void>
    - isLoading: boolean
  States: loading | success | disabled
  Location: /components/faculty-dashboard/InitiateSalaryButton.tsx
```

#### Data Requirements

```
Query Function: getFacultyProgressData(userId: string)
  Purpose: Fetch all data needed for faculty dashboard in one query
  Returns: {
    progress: number (0-100),
    tokenBalance: number,
    loanBalance: number | null,
    pendingTransfer: boolean,
  }
  Error Cases: User not found, database connection error
  Located In: lib/db/queries/faculty.ts

Query Function: getTodayClassSchedule(userId: string)
  Purpose: Get all classes scheduled for today for this faculty
  Returns: StructuredTask[] with fields {
    id, subject, startTime, endTime, room, enrolledCount, attendanceMarked
  }
  Error Cases: No classes today (return empty array)
  Located In: lib/db/queries/structured-tasks.ts

Query Function: getMyTaskNominations(userId: string)
  Purpose: Get all tasks this faculty has nominated for
  Returns: TaskNomination[] with fields {
    taskId, taskTitle, status, nominatedAt, tokenValue, hodReview
  }
  Error Cases: No nominations (return empty array)
  Located In: lib/db/queries/unstructured-tasks.ts
```

#### Backend Tables & Fields

```
Table: users
  Fields needed:
    - id: UUID → Used for: identify current faculty
    - progress_percentage: DECIMAL(3,2) → Used for: ProgressRing display
    - token_balance: DECIMAL(10,2) → Used for: TokenBalanceWidget
    - role: ENUM['FACULTY','HOD','DIRECTOR','FINANCE'] → Used for: RoleGate verification
  Example query:
    SELECT id, progress_percentage, token_balance FROM users WHERE id = $1
  Link to schema: implementation_plan.md → section 3.1 Users Table

Table: structured_tasks
  Fields needed:
    - id: UUID → Used for: class identifier
    - faculty_id: FK → Used for: filter to current faculty
    - subject: VARCHAR → Used for: display class name
    - scheduled_at: TIMESTAMP → Used for: check if today
    - duration_minutes: INT → Used for: show time
    - room_location: VARCHAR → Used for: show classroom
    - attendance_marked: BOOLEAN → Used for: show checkbox state
  Example query:
    SELECT * FROM structured_tasks 
    WHERE faculty_id = $1 AND DATE(scheduled_at) = CURRENT_DATE
    ORDER BY scheduled_at ASC
  Link to schema: implementation_plan.md → section 3.2 Structured Tasks

Table: task_nominations
  Fields needed:
    - id: UUID → Used for: track nomination
    - faculty_id: FK → Used for: filter to current user
    - task_id: FK → Used for: link to task details
    - status: ENUM['PENDING','ASSIGNED','COMPLETED','REJECTED'] → Used for: show status badge
    - nominated_at: TIMESTAMP → Used for: sorting
    - hod_notes: TEXT → Used for: show feedback
  Example query:
    SELECT tn.*, ut.title, ut.token_value FROM task_nominations tn
    JOIN unstructured_tasks ut ON tn.task_id = ut.id
    WHERE tn.faculty_id = $1 ORDER BY tn.nominated_at DESC
  Link to schema: implementation_plan.md → section 3.5 Task Nominations
```

#### Page Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header (sticky, gap-4)                              │
│  • Title: "Dashboard"                               │
│  • User name: "Welcome, Dr. Singh"                  │
│  • Last updated: "Updated 2 hours ago"              │
└─────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────┐
│                  │  Main Content (flex-1)           │
│ Sidebar          │  ┌────────────────────────────┐  │
│ (30% width)      │  │ Today's Schedule Card       │  │
│ sticky           │  │ • Math 101 (10:00-11:30)   │  │
│ gap-4            │  │ • Physics Lab (14:00-15:30)│  │
│                  │  │ [Mark Attendance Button]    │  │
│ ┌──────────────┐ │  └────────────────────────────┘  │
│ │ Progress     │ │  gap-6                           │
│ │ Ring         │ │  ┌────────────────────────────┐  │
│ │ 64% / 85%    │ │  │ My Nominations              │  │
│ │              │ │  │ • Event Planning (Pending)  │  │
│ │ [85% color]  │ │  │ • Mentoring (Assigned)      │  │
│ └──────────────┘ │  └────────────────────────────┘  │
│ gap-4            │  gap-6                           │
│ ┌──────────────┐ │  ┌────────────────────────────┐  │
│ │Token Balance │ │  │ [Initiate Salary Button]    │  │
│ │Balance: 450  │ │  │ (only if progress >= 85%)   │  │
│ │Loan: None    │ │  └────────────────────────────┘  │
│ └──────────────┘ │                                  │
│                  │                                  │
└──────────────────┴──────────────────────────────────┘
```

#### User Flow (Step-by-Step)

```
1. Faculty lands on /dashboard
   └─ Page starts loading data (show LoadingSkeletons for all cards)

2. getFacultyProgressData, getTodayClassSchedule, getMyTaskNominations run in parallel
   ├─ On success: replace skeletons with real data
   ├─ On error for one: show ErrorFallback for that section with retry
   └─ Empty states: if no classes today, show "No classes scheduled"

3. Faculty sees:
   ├─ Progress Ring filled to 64% (not yet at 85%)
   ├─ Today's schedule with 2 classes (can mark attendance)
   ├─ 2 task nominations (one pending, one assigned)
   ├─ Token balance of 450
   └─ InitiateSalaryButton is HIDDEN (progress < 85%)

4. Faculty marks attendance on a class
   ├─ Click checkbox next to "Math 101"
   ├─ Shows loading spinner on button
   ├─ API call: PATCH /api/attendance/mark
   ├─ On success: checkbox turns green, show "Marked" badge
   ├─ Refresh progress data (may update % if this pushes them over 85%)
   └─ On error: show error toast "Failed to mark attendance"

5. If progress reaches 85% after marking attendance
   ├─ Progress Ring color changes to success green
   ├─ InitiateSalaryButton becomes VISIBLE with animation
   ├─ Faculty can now click "Initiate Salary Transfer"

6. Faculty clicks "Initiate Salary Transfer" (if >= 85%)
   ├─ Show confirmation dialog (blur effect from One UI spec)
   ├─ "Are you sure? This will send your salary for approval."
   ├─ On confirm: POST /api/salary/initiate
   ├─ On success: show success toast, disable button, update status
   └─ On error: show error toast, keep button enabled
```

#### Design Specifications

```
Typography:
  Page Title: .text-title (36px, 700 Bold) - "Dashboard"
  Section Headings: .text-heading (24px, 600 Semibold) - "Today's Schedule"
  Card Titles: .text-subtitle (20px, 700 Bold) - "My Nominations"
  Body Text: .text-body (14px, 400 Regular) - class details, descriptions
  Small labels: .text-caption (12px, 400 Regular) - "Last updated 2 hours ago"

Colors:
  Progress Ring (0-84%): bg-warning (#FFC30C)
  Progress Ring (85%+): bg-success (#00C853)
  Section backgrounds: bg-container-dark (#1717A1A)
  Active status badge: bg-success text-foreground-dark
  Pending status badge: bg-warning text-black
  Button primary: bg-primary (#817AFF) hover:bg-secondary
  Button disabled: opacity-50 cursor-not-allowed

Spacing:
  Page container: px-6 py-4 (md:px-8 md:py-6)
  Header section: pb-8 border-b border-component-border-dark
  Main content gap: gap-8
  Sidebar components: gap-4 between cards
  Card padding: p-6
  Button padding: px-6 py-3

Radius:
  Cards: rounded-xl
  Progress Ring: rounded-full (100%)
  Buttons: rounded-lg
  Status badges: rounded-full
  Checkboxes: rounded-lg

Responsive:
  Mobile (default): flex flex-col (stack vertically)
    - Sidebar full width (mb-6)
    - Main content below
  Tablet (md:): flex flex-row gap-6
    - Sidebar 30% width
    - Main 70% flex-1
  Desktop (lg:): same as tablet, but with more generous spacing

Shadows:
  Cards: shadow-lg
  Hover: hover:shadow-xl
  Active buttons: active:brightness-75

Transitions:
  All interactive: transition-all duration-200
  Progress Ring: transition-colors duration-500 (when reaching 85%)
```

#### Key Rules for This Page

```
□ NO mock data - Use only data from getFacultyProgressData, getTodayClassSchedule, getMyTaskNominations
□ Three states on each card: LoadingSkeleton while loading, ErrorFallback on error, real data on success
□ Use <RoleGate requiredPermission="VIEW_FACULTY_DASHBOARD"> wrapper on entire page
□ CSS tokens only - use bg-primary, text-foreground-dark, never hardcode #817AFF
□ Empty state component if no classes today - don't show blank card
□ Error fallback with "Retry" button - don't show broken page
□ Mobile responsive: test at 320px (mobile), 768px (tablet), 1024px (desktop)
□ Accessibility: alt text on icons, ARIA labels, tab order, focus visible on buttons
□ All buttons show loading state while API call is in progress
□ No console errors or warnings
□ PascalCase component names, use suspense boundaries for data fetching
```

#### Success Criteria

```
✅ Page loads with real data from three query functions
✅ Loading state shows skeletons while fetching (no blank page)
✅ Error state shows with "Retry" button (test by simulating DB error)
✅ Empty state shows "No classes scheduled" if no classes today
✅ Progress Ring shows correct percentage (0-100) with right color
✅ Today's schedule shows all classes for today in time order
✅ "Mark Attendance" checkbox works, shows spinner, updates data
✅ My Nominations list shows correct status badges (Pending, Assigned)
✅ Token balance displays correctly
✅ InitiateSalaryButton hidden when progress < 85%
✅ InitiateSalaryButton visible and clickable when progress >= 85%
✅ Colors match One UI spec (warning yellow, success green, primary purple)
✅ Typography matches spec (36px title, 24px headings, 14px body)
✅ Responsive at 320px, 768px, 1024px widths
✅ Accessible: tab navigation works, screen reader labels present, focus visible
✅ No hardcoded colors or arbitrary margins
✅ No console errors or warnings in dev tools
```

#### Build Order for Faculty Dashboard

```
1. Create file structure
   /app/dashboard/page.tsx (main page with role detection)
   /components/faculty-dashboard/ProgressRing.tsx
   /components/faculty-dashboard/TodayScheduleCard.tsx
   /components/faculty-dashboard/MyNominationsCard.tsx
   /components/faculty-dashboard/TokenBalanceWidget.tsx
   /components/faculty-dashboard/InitiateSalaryButton.tsx

2. Ensure query functions exist
   ✓ getFacultyProgressData in lib/db/queries/faculty.ts
   ✓ getTodayClassSchedule in lib/db/queries/structured-tasks.ts
   ✓ getMyTaskNominations in lib/db/queries/unstructured-tasks.ts

3. Build static layout
   - Create page shell
   - Add sidebar (30% width, sticky)
   - Add main content area (70% width)
   - Add placeholder cards with grid/flex layout
   - Test responsive design

4. Add data fetching
   - In page.tsx, fetch all three query functions
   - Implement loading state (show LoadingSkeletons)
   - Implement error state (show ErrorFallback with retry)
   - Implement success state (pass data to components)

5. Build ProgressRing component
   - Accept currentProgress prop
   - Draw SVG circle with percentage fill
   - Color changes based on progress (warning if < 85%, success if >= 85%)
   - Show percentage text in center

6. Build TodayScheduleCard component
   - Accept classes array
   - Map over classes, show each with time, room, attendance checkbox
   - Add "Mark Attendance" button per class
   - Show "No classes scheduled" if empty

7. Build MyNominationsCard component
   - Accept nominations array
   - Map over nominations, show each with title, status badge
   - Use correct badge color (yellow for pending, purple for assigned, green for completed)
   - Show "No nominations yet" if empty

8. Build TokenBalanceWidget component
   - Display balance number prominently (24px)
   - Display loan balance if exists
   - Show simple row: "Balance: 450 | Loan: None"

9. Build InitiateSalaryButton component
   - Only render if progress >= 85% AND no pending transfer
   - Show loading spinner while submitting
   - On success: show "Transfer initiated!" and disable button
   - On error: show error toast

10. Add interactivity
    - Wire up "Mark Attendance" button → API call → refresh progress
    - Wire up "Initiate Salary Transfer" → confirmation dialog → API call
    - Add success/error toast notifications

11. Style and polish
    - Verify all colors match One UI spec
    - Verify all typography (sizes, weights) match spec
    - Fix responsive issues at 320px, 768px, 1024px
    - Add hover states to buttons and cards
    - Add transitions/animations for state changes

12. Test and verify
    - Test loading state (API takes 2s)
    - Test error state (simul DB failure)
    - Test empty state (no classes today)
    - Test success path (all data loads, can mark attendance)
    - Test responsive design on all breakpoints
```

---

## CUSTOMIZATION GUIDE

To fill out this template for YOUR assigned page:

1. **Copy the template section** above (starting with "### TASK: Build...")
2. **Fill in YOUR page details**:
   - Replace `[PAGE_NAME]` with actual page name
   - Replace `[route-path]` with actual route
   - Replace `[ROLE]` with required role
   - Replace `[ComponentName]` with actual component names
   - Replace `[table_name]` with actual table names
   - Replace example queries with actual queries from implementation_plan.md

3. **Keep the structure identical** - Don't skip sections
4. **Be specific** - No vague descriptions
5. **Include error cases** - Think about what can go wrong
6. **Verify links** - Point to correct files in codebase

---

## FINAL CHECKLIST BEFORE GIVING TO AI AGENT

```
□ Replaced all [BRACKET_PLACEHOLDERS] with actual values
□ Route is accurate and matches implementation_plan.md
□ Role required is clearly stated
□ All components listed with their purpose
□ All query functions documented with return types
□ All backend tables listed with required fields
□ User flow is step-by-step (not vague)
□ Design specs match One UI system (colors, typography, spacing)
□ Key rules section is complete and specific
□ Success criteria are testable and objective
□ Build order is logical sequence (layout → data → interaction → style)
□ Examples are realistic and helpful

If anything is unclear or generic, your agent will hallucinate.
Specificity = agent success.
```

---

**Last Updated**: July 8, 2026
**Version**: 1.0 - Complete Page Building Template
**Usage**: Copy relevant section and fill with your page details before assigning to AI
