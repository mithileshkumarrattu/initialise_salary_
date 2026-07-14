# WORKTOKEN DEMO SaaS - COMPLETE MOCK BUILD SPECIFICATION

## CRITICAL PRINCIPLES
- **NO DATABASE** - Everything in browser storage (localStorage/sessionStorage)
- **FEELS REAL** - Every interaction has loading states, delays, animations
- **HARDCODED BUT REALISTIC** - Mock data looks like real data (realistic names, numbers, dates)
- **PRODUCTION QUALITY UI** - One UI design system, proper error handling, empty states
- **WORKS WITHOUT INTERNET** - All data persists locally
- **ROLE-BASED NAVIGATION** - Each role sees different sidebar + pages

---

## FLOW ARCHITECTURE

```
Entry Point
    ↓
[Login/Signup] (no DB, mock only)
    ↓
[Setup Wizard]
    ├─ Choose Template → COLLEGE or GENERIC
    ├─ Choose Organization Name
    ├─ Choose Your Role
    └─ Load Mock Data for that Role
    ↓
[Dashboard] (role-specific)
    ↓
[Role-Specific Pages]
```

---

## PART 1: AUTHENTICATION (No Database)

### Login Page
- Email input + Password input
- Mock validation:
  - Any email works
  - Any password works (minimum 6 chars)
  - Show loading spinner for 1.2 seconds (feels real)
  - Then show success toast
  - Redirect to Setup Wizard
- Store in localStorage:
  - `auth_user: { email, role, template }`
  - `auth_token: "demo_token_xyz"`

### Signup Page
- Name, Email, Password, Confirm Password
- Same mock validation as login
- Create user in localStorage
- Show success: "Account created successfully"
- Redirect to login

### Session Persistence
- On page load, check `localStorage.auth_user`
- If exists and not expired (set 24hr expiry), auto-login
- If expired, redirect to login

---

## PART 2: SETUP WIZARD (First-time only)

### Step 1: Template Selection
```
Question: "What are you building?"
Options:
  1. College/University (instructor-student task management)
  2. Generic Software Company (enterprise task management)
```
- Show cards with descriptions
- Store selection: `localStorage.template = "college"` or `"generic"`

### Step 2: Organization Name
```
Question: "What's your organization name?"
Input field with placeholder:
  - College: "Placeholder: MIT, Stanford University"
  - Generic: "Placeholder: Acme Corp, TechStart Inc"
```
- Store: `localStorage.org_name`

### Step 3: Role Selection

**IF COLLEGE TEMPLATE:**
```
Question: "What's your role?"
Options:
  1. Director (Dean/Principal) 
     → Can see all depts, institute metrics
  2. HOD (Head of Department)
     → Can see only their dept tasks/approvals
  3. Financial Department Head
     → Can see budget, expenses, payroll
  4. Faculty (Instructor)
     → Can see personal tasks, student feedback
```

**IF GENERIC TEMPLATE:**
```
Question: "What's your role?"
Options:
  1. Executive/Manager
     → Can see company metrics, all teams
  2. Team Lead
     → Can see team metrics, approvals
  3. Finance Manager
     → Can see budget, expenses
  4. Developer/Team Member
     → Can see personal tasks, projects
```

- Store: `localStorage.user_role`
- Store: `localStorage.template`

### Step 4: Load Mock Data
```
Show: "Setting up your dashboard..."
Show loading bar (fake progress 0-100% over 2 seconds)
Then redirect to Dashboard
```

---

## PART 3: MOCK DATA STRUCTURE

### Store in localStorage as JSON:
```javascript
localStorage.mockData = JSON.stringify({
  users: [ /* All users in org */ ],
  tasks: [ /* All tasks */ ],
  approvals: [ /* All pending approvals */ ],
  departments: [ /* All departments */ ],
  financials: [ /* Budget/expense data */ ],
  orgChart: [ /* Hierarchy nodes */ ]
})
```

### Mock Users (College Template)
```
DIRECTOR Role:
  - Name: Dr. James Anderson
  - Email: director@college.edu
  - Department: Administration
  - Since: Jan 2020

HOD Role (3 different HODs):
  1. Dr. Sarah Chen (Computer Science)
  2. Dr. Marcus Williams (Physics)
  3. Dr. Priya Patel (Mathematics)

FINANCIAL DEPT Role:
  - Name: Mr. Robert Johnson
  - Email: finance@college.edu

FACULTY Role (5-6 different faculty):
  1. Prof. Emma Davis (CS - Data Science)
  2. Prof. Alex Kumar (CS - Web Dev)
  3. Prof. Lisa Wong (Physics - Quantum)
  4. Prof. James Martin (Physics - Mechanics)
  5. Prof. Aisha Ahmed (Math - Calculus)
  6. Prof. Tom Wilson (Math - Linear Algebra)
```

### Mock Users (Generic Template)
```
EXECUTIVE Role:
  - Name: Sarah Mitchell
  - Email: ceo@techstart.com
  - Company: TechStart Inc

TEAM LEAD Role (3 different):
  1. Alex Rodriguez (Engineering Team)
  2. Jordan Chen (Product Team)
  3. Casey Lee (Design Team)

FINANCE MANAGER Role:
  - Name: Michael Brown

DEVELOPER/MEMBER Role (5-6 different):
  1. Dev - Frontend specialist
  2. Dev - Backend specialist
  3. Designer - UI/UX
  4. Designer - Brand
  5. PM - Product Strategy
  6. QA - Testing specialist
```

### Mock Departments (College)
```
1. Computer Science
   - Budget: $2.5M
   - Faculty: 8
   - Students: 450
   - Status: High

2. Physics
   - Budget: $1.8M
   - Faculty: 6
   - Students: 280
   - Status: Moderate

3. Mathematics
   - Budget: $1.2M
   - Faculty: 5
   - Students: 350
   - Status: High
```

### Mock Tasks (College - Faculty perspective)
```
Task 1: Grade Midterm Exams
  - Title: Grade Midterm Exams (CS 201)
  - Points: 50
  - Priority: HIGH
  - Deadline: 2025-01-25
  - Status: IN_PROGRESS (55% done)
  - Created: 5 days ago
  - Assigned By: Director
  
Task 2: Design New Course Module
  - Title: Design ML Course Module
  - Points: 150
  - Priority: MEDIUM
  - Deadline: 2025-02-10
  - Status: PENDING
  - Created: 2 days ago
  
Task 3: Student Mentoring Sessions
  - Title: Weekly Mentoring - 10 Hours
  - Points: 80
  - Priority: LOW
  - Deadline: 2025-01-30
  - Status: COMPLETED
  - Created: 10 days ago
  - Completed: 2025-01-20

Task 4: Research Paper Review
  - Title: Review 5 Student Research Papers
  - Points: 120
  - Priority: MEDIUM
  - Deadline: 2025-02-05
  - Status: IN_PROGRESS (30% done)
```

### Mock Tasks (Generic - Developer perspective)
```
Task 1: Fix Bug - Login Page Timeout
  - Title: Fix authentication timeout bug
  - Points: 30
  - Priority: HIGH
  - Deadline: 2025-01-24
  - Status: IN_PROGRESS (70% done)
  - Assigned By: Team Lead
  
Task 2: Feature - Dark Mode Toggle
  - Title: Implement dark mode for dashboard
  - Points: 80
  - Priority: MEDIUM
  - Deadline: 2025-02-05
  - Status: PENDING
  
Task 3: Code Review - Payment Module
  - Title: Review and approve payment integration PR
  - Points: 40
  - Priority: HIGH
  - Deadline: 2025-01-22
  - Status: PENDING

Task 4: Documentation - API Endpoints
  - Title: Write API documentation (20 endpoints)
  - Points: 60
  - Priority: LOW
  - Deadline: 2025-02-15
  - Status: COMPLETED
```

### Mock Approvals (HOD/Manager perspective)
```
Approval 1: Grade Submission (Pending)
  - From: Prof. Emma Davis
  - Task: Grade Midterm Exams
  - Status: PENDING
  - Submitted: 2025-01-20 14:30
  - Actions: [APPROVE] [REQUEST_REVISION] [REJECT]
  - Notes: "Submitted 100 grades"

Approval 2: Course Module Design (Pending)
  - From: Prof. James Martin
  - Task: Design Mechanics Lab Module
  - Status: PENDING
  - Submitted: 2025-01-21 09:15
  - Actions: [APPROVE] [REQUEST_REVISION] [REJECT]
  - Notes: "New lab experiment design"

Approval 3: Research Hours (Approved)
  - From: Prof. Lisa Wong
  - Task: Research Time - 20 hours
  - Status: APPROVED
  - Submitted: 2025-01-18
  - Approved By: Dr. Sarah Chen
  - Approved: 2025-01-19
  - Points Awarded: 120
```

### Mock Financial Data
```
Department Budget (College):
  - CS: $2.5M (Spent: $2.1M = 84%)
  - Physics: $1.8M (Spent: $1.5M = 83%)
  - Math: $1.2M (Spent: $950K = 79%)
  - Total: $5.5M (Spent: $4.55M = 83%)

Monthly Expenses (Last 6 months):
  - Jan: $785K (Staff: $500K, Equipment: $200K, Other: $85K)
  - Dec: $820K (Staff: $500K, Equipment: $250K, Other: $70K)
  - Nov: $710K (Staff: $500K, Equipment: $150K, Other: $60K)
  - Oct: $795K (Staff: $500K, Equipment: $220K, Other: $75K)
  - Sep: $775K (Staff: $500K, Equipment: $210K, Other: $65K)
  - Aug: $800K (Staff: $500K, Equipment: $240K, Other: $60K)

Payroll Summary:
  - Total Staff: 45
  - Avg Salary: $85K
  - Monthly: $500K fixed
  - Growth YoY: 5%
```

### Mock Org Chart (Director view - College)
```
Root: Director (Dr. James Anderson)
  ├── HOD - Computer Science (Dr. Sarah Chen)
  │   ├── Faculty (Prof. Emma Davis)
  │   ├── Faculty (Prof. Alex Kumar)
  │   └── Admin Staff
  ├── HOD - Physics (Dr. Marcus Williams)
  │   ├── Faculty (Prof. Lisa Wong)
  │   ├── Faculty (Prof. James Martin)
  │   └── Admin Staff
  ├── HOD - Mathematics (Dr. Priya Patel)
  │   ├── Faculty (Prof. Aisha Ahmed)
  │   ├── Faculty (Prof. Tom Wilson)
  │   └── Admin Staff
  └── Finance Head (Mr. Robert Johnson)
      └── Finance Staff (2 people)
```

---

## PART 4: PAGE SPECIFICATIONS

### LAYOUT STRUCTURE (All Pages)
```
┌─────────────────────────────────────────┐
│ Header                                  │
│ (Logo, Org Name, User Profile, Logout) │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content Area           │
│          │  (role-specific pages)       │
│ (Role    │                              │
│  Links)  │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### SIDEBAR NAVIGATION (Same for all, content differs)

**DIRECTOR (College):**
1. Dashboard
2. Organization Chart
3. Financial Overview
4. Department Reports
5. Settings
6. Logout

**HOD (College):**
1. Dashboard
2. Department View
3. Approvals Pending
4. Faculty Management
5. Budget Tracking
6. Settings
7. Logout

**FINANCIAL DEPT (College):**
1. Dashboard
2. Budget Overview
3. Expense Tracking
4. Payroll
5. Reports
6. Settings
7. Logout

**FACULTY (College):**
1. My Tasks
2. Task History
3. Approvals Status
4. Profile
5. Settings
6. Logout

**Similar structure for Generic template but with different titles**

---

## PART 5: ROLE-SPECIFIC PAGES

### DIRECTOR PAGES (College)

#### Page 1: Dashboard
**URL:** `/dashboard`

```
HEADER SECTION (Always visible):
  - Org Name: "Landmark University"
  - Title: "Institute Overview"
  - Last Updated: "Jan 21, 2025 - 2:30 PM"

LOADING STATE:
  Show: Skeleton loaders for 1.5 seconds
  Then: Fade in real content

METRICS CARDS (4 cards in grid):
  Card 1: Total Faculty
    - Number: 28 (large, bold, One UI purple)
    - Subtitle: "Across 3 Departments"
    - Trend: ↑ 2 new hires
    - Badge: "Active"

  Card 2: Total Tasks Pending
    - Number: 47
    - Subtitle: "Across Institute"
    - Trend: ↑ 5 new tasks this week
    - Badge: "16 High Priority"

  Card 3: Budget Utilization
    - Number: 83% ($4.55M / $5.5M)
    - Subtitle: "Current Fiscal Year"
    - Bar Chart: Visual representation
    - Trend: "On track for year"

  Card 4: Department Efficiency
    - Number: 87% (avg)
    - Subtitle: "Task Completion Rate"
    - Mini Pie Chart: CS 89%, Physics 85%, Math 87%
    - Status: "Good"

SECTION: Department Summary (Table)
  Columns: Department | Faculty | Tasks | Efficiency | Budget
  Row 1: Computer Science | 8 | 24 | 89% | $2.1M/$2.5M
  Row 2: Physics | 6 | 15 | 85% | $1.5M/$1.8M
  Row 3: Mathematics | 5 | 12 | 87% | $950K/$1.2M
  
  Each row: Clickable → shows dept detail page

SECTION: Recent Activities (List)
  Activity 1: "Prof. Emma Davis completed grading task" - 2 hours ago
  Activity 2: "Dr. Sarah Chen approved 5 tasks" - 4 hours ago
  Activity 3: "New budget request from CS Dept" - 1 day ago
  Activity 4: "Physics Dept completed project milestone" - 2 days ago
```

#### Page 2: Organization Chart
**URL:** `/org-chart`

```
LAYOUT: Hierarchical tree view

ROOT NODE: Dr. James Anderson (Director)
  Position: Center, top
  Avatar: Placeholder avatar
  Title: Director

FIRST LEVEL NODES: 3 HODs + Finance Head
  - Dr. Sarah Chen (Computer Science)
  - Dr. Marcus Williams (Physics)
  - Dr. Priya Patel (Mathematics)
  - Mr. Robert Johnson (Finance Head)

SECOND LEVEL NODES: Faculty under each HOD
  CS Dept:
    - Prof. Emma Davis
    - Prof. Alex Kumar
  Physics Dept:
    - Prof. Lisa Wong
    - Prof. James Martin
  Math Dept:
    - Prof. Aisha Ahmed
    - Prof. Tom Wilson

INTERACTIONS:
  - Hover on node: Show tooltip with name, role, email
  - Click on node: Show modal with person details
  - Add Node Button: Modal to add new person (stores in cache)
    Fields: Name, Role, Email, Parent Node
    Shows loading spinner when saving
    Toast: "Person added successfully"

FEATURES:
  - Zoom in/out (mouse wheel)
  - Drag to pan
  - Download as PDF (shows loading spinner)
  - Each node color-coded by role:
    Purple (#8F7AFF): Director
    Blue (#64B5F6): HOD
    Cyan (#00D4FF): Finance
    Gray: Faculty
```

#### Page 3: Financial Overview
**URL:** `/financial`

```
HEADER: "Institute Financial Dashboard"

SECTION 1: Budget Status (Large card)
  - Total Budget: $5.5M
  - Spent: $4.55M (83%)
  - Remaining: $950K (17%)
  - Progress Bar (animated fill)
  - Trend: "On track, expected to use 95% by year-end"

SECTION 2: Department Budget Breakdown (3 cards)
  Card 1: CS Department
    - Budget: $2.5M
    - Spent: $2.1M (84%)
    - Status: "Within Budget"
  
  Card 2: Physics Department
    - Budget: $1.8M
    - Spent: $1.5M (83%)
    - Status: "Within Budget"
  
  Card 3: Mathematics Department
    - Budget: $1.2M
    - Spent: $950K (79%)
    - Status: "Within Budget"

SECTION 3: Monthly Spending Graph
  - X-axis: Aug, Sep, Oct, Nov, Dec, Jan
  - Y-axis: Amount ($K)
  - Line chart: Red if over $850K, green if under
  - Data points show exact amounts on hover
  - Trend line: "Average $785K/month"

SECTION 4: Expense Categories (Pie chart)
  - Staff: 65% ($4.95M)
  - Equipment: 28% ($2.14M)
  - Other: 7% ($0.54M)
  - Hover shows exact amounts

SECTION 5: Recent Transactions (Table)
  Columns: Date | Category | Department | Amount | Status
  Row 1: Jan 20 | Equipment | CS | $45K | Approved
  Row 2: Jan 18 | Staff Salary | All | $500K | Processed
  Row 3: Jan 15 | Equipment | Physics | $30K | Pending
  Row 4: Jan 10 | Other | Math | $5K | Approved
```

---

### HOD PAGES (College - Dr. Sarah Chen, CS Department)

#### Page 1: Dashboard
**URL:** `/dashboard`

```
HEADER: "Computer Science Department Dashboard"
  Subtitle: "Your Department Overview"
  
CARDS (3 cards):
  Card 1: My Faculty
    - Number: 8
    - Subtitle: "Active instructors"
    - Status: "All Active"
    - Mini list: Shows 3 faculty with avatars

  Card 2: Pending Approvals
    - Number: 7
    - Subtitle: "Waiting for your review"
    - Highlight: "3 HIGH PRIORITY"
    - Button: "Review Now" (navigate to Approvals)

  Card 3: Department Tasks
    - Number: 24 Total
    - Breakdown: 8 Completed, 10 In Progress, 6 Pending
    - Status Bar: Visual representation
    - Completion: "67%"

SECTION: Task Summary (Table)
  Columns: Task | Faculty | Status | Deadline | Points
  Row 1: Grade Midterms | Prof. Emma Davis | IN_PROGRESS | Jan 25 | 50
  Row 2: Design Module | Prof. Alex Kumar | PENDING | Feb 10 | 150
  Row 3: Lab Setup | Prof. Emma Davis | COMPLETED | Jan 15 | 80
  Row 4: Student Mentoring | Prof. Alex Kumar | IN_PROGRESS | Jan 30 | 80

SECTION: Faculty Performance (Cards grid)
  Each faculty card shows:
    - Name & Avatar
    - Tasks Completed: 12
    - Current Points: 850
    - Status: "Productive" (green badge)
    - Trend: "↑ 3 tasks this week"
    - Button: "View Profile"
```

#### Page 2: Department View
**URL:** `/dept-view`

```
HEADER: "Computer Science - Full View"

SECTION 1: Department Statistics
  - Faculty: 8
  - Students: 450
  - Courses: 24
  - Budget: $2.5M (84% spent)
  - Efficiency: 89%

SECTION 2: Faculty List (Detailed table)
  Columns: Name | Email | Courses | Tasks | Status | Action
  
  Row 1: Prof. Emma Davis
    Courses: 3 (CS 101, CS 201, CS 301)
    Tasks: 5 (3 completed, 2 pending)
    Status: "Active" (green badge)
    Actions: [View Profile] [Assign Task]
  
  Row 2: Prof. Alex Kumar
    Similar structure

SECTION 3: Course Management (Table)
  Columns: Course Code | Name | Faculty | Students | Status
  
  CS 101 | Intro to Programming | Prof. Emma Davis | 120 | Active
  CS 201 | Data Structures | Prof. Alex Kumar | 85 | Active
  CS 301 | Advanced Algorithms | Prof. Emma Davis | 45 | Active

SECTION 4: Open Tasks (Needs assignment)
  - Task: "Grade Final Exams" | Points: 120 | [Assign to Faculty]
  - Task: "Create Lab Assignments" | Points: 80 | [Assign to Faculty]
  - Task: "Review Student Projects" | Points: 100 | [Assign to Faculty]
```

#### Page 3: Approvals Pending
**URL:** `/approvals`

```
HEADER: "Task Approvals - Pending Actions"
  Subtitle: "You have 7 items to review"

FILTER TABS: All | Pending | Approved | Rejected

DEFAULT VIEW: All Pending (7 items)

EACH APPROVAL CARD:
  
  Approval 1:
    From: Prof. Emma Davis
    Task: Grade Midterm Exams (CS 201)
    Submitted: Jan 20, 2025 - 2:30 PM
    Status: PENDING (orange badge)
    
    DETAILS SECTION:
      Task Points: 50
      Submission Notes: "100 grades submitted. Average class score: 78%"
      Attached File: "[grades_cs201.csv]"
      
    ACTION BUTTONS:
      [APPROVE] (green) [REQUEST REVISION] (yellow) [REJECT] (red)
      
    APPROVAL MODAL (when clicked):
      Shows loading spinner
      After 1 second: "Approved!"
      Toast: "Task approved. 50 points awarded to Prof. Emma Davis"
      Card moves to "Approved" tab

SECTION: History (Completed approvals)
  - Approved: "Course Module - Physics" by Prof. James Martin (Jan 19)
  - Approved: "Student Mentoring Hours" by Prof. Alex Kumar (Jan 18)
  - Rejected: "Budget Request" by Finance Head (Jan 17)
  - Approved: "Lab Equipment Setup" by Prof. Lisa Wong (Jan 15)
```

---

### FINANCIAL DEPT HEAD PAGES (Generic)

#### Page 1: Dashboard
**URL:** `/dashboard`

```
HEADER: "Finance Department Dashboard"

KEY METRICS (4 cards):
  Card 1: Total Budget
    - Amount: $5.5M
    - Status: "Current FY"
    - Spent: 83%

  Card 2: Monthly Expenses
    - Latest: $785K (Jan)
    - Trend: "↓ 3% vs last month"
    - Average: $787K

  Card 3: Payroll Status
    - Staff Count: 45
    - Monthly: $500K
    - Status: "All paid"

  Card 4: Pending Approvals
    - Count: 3
    - High Priority: 1
    - Action: "Review"

SECTION: Monthly Burn Chart (6 months)
  Visual line graph with data points
  Jan: $785K
  Dec: $820K
  Nov: $710K
  Oct: $795K
  Sep: $775K
  Aug: $800K

SECTION: Budget Status by Category
  Staff: $4.95M / $5.5M (90%)
  Equipment: $2.14M / $2.5M (86%)
  Other: $0.54M / $0.5M (108% - OVER)
  
  Red indicator on "Other" category
```

#### Page 2: Payroll Management
**URL:** `/payroll`

```
HEADER: "Payroll Management"

SECTION: Current Payroll Info
  - Total Staff: 45
  - Avg Salary: $85K/year ($7,083/month)
  - Total Monthly: $500K (fixed)
  - Next Processing: Jan 31, 2025
  - Status: "On Schedule"

SECTION: Staff List (Table)
  Columns: Name | Department | Role | Salary/Month | Status
  
  Row 1: Dr. James Anderson | Admin | Director | $12,000 | Active
  Row 2: Dr. Sarah Chen | CS | HOD | $8,500 | Active
  Row 3: Prof. Emma Davis | CS | Faculty | $6,500 | Active
  Row 4: Mr. Robert Johnson | Finance | Head | $7,000 | Active
  ... (more staff)

SECTION: Payroll History
  Jan 2025: $500K (Processed Jan 20)
  Dec 2024: $500K (Processed Dec 20)
  Nov 2024: $500K (Processed Nov 20)
  Oct 2024: $500K (Processed Oct 20)
```

---

### FACULTY PAGES (College - Prof. Emma Davis)

#### Page 1: My Tasks
**URL:** `/my-tasks`

```
HEADER: "My Tasks"
  Subtitle: "Prof. Emma Davis - Computer Science"

FILTER TABS: All | Pending | In Progress | Completed

DEFAULT VIEW: All Tasks (4 total)

TASK CARDS (displayed as list):

Task 1: Grade Midterm Exams (CS 201)
  Status: IN_PROGRESS (progress bar 55%)
  Points: 50
  Priority: HIGH (red badge)
  Deadline: Jan 25, 2025 (3 days left - red warning)
  Description: "Grade 120 student midterm exams"
  Assigned By: Dr. Sarah Chen (HOD)
  Assigned: 5 days ago
  
  ACTIONS: [VIEW DETAILS] [SUBMIT FOR APPROVAL] [MARK COMPLETE]

Task 2: Design New Course Module
  Status: PENDING
  Points: 150
  Priority: MEDIUM
  Deadline: Feb 10, 2025
  Description: "Design ML module for CS 301 course"
  
  ACTIONS: [VIEW DETAILS] [START] [MARK COMPLETE]

Task 3: Student Mentoring Sessions (Weekly - 10 hrs)
  Status: COMPLETED
  Points: 80
  Completed Date: Jan 20, 2025 (1 day ago)
  Description: "Weekly mentoring for 10 students"
  Approval Status: APPROVED (green badge)
  
  ACTIONS: [VIEW DETAILS] [ARCHIVED]

Task 4: Research Paper Review
  Status: IN_PROGRESS (30%)
  Points: 120
  Priority: MEDIUM
  Deadline: Feb 5, 2025
  Description: "Review 5 student research papers"
  
  ACTIONS: [VIEW DETAILS] [SUBMIT FOR APPROVAL]

SECTION: Task Statistics
  - Total Points Earned: 280/400 (70%)
  - Tasks Completed: 12
  - Tasks Pending: 2
  - Current Streak: 8 days
```

#### Page 2: Task History
**URL:** `/task-history`

```
HEADER: "Task History"

TIMELINE VIEW (chronological, newest first):

Jan 20: "Student Mentoring Sessions" - COMPLETED
  Points: 80
  Approved by: Dr. Sarah Chen

Jan 15: "Lab Assignment Creation" - COMPLETED
  Points: 60
  Approved by: Dr. Sarah Chen

Jan 10: "Grade Assignment 3" - COMPLETED
  Points: 40
  Approved by: Dr. Sarah Chen

Jan 5: "Course Material Update" - COMPLETED
  Points: 70
  Approved by: Director

Dec 28: "Year-end Report" - COMPLETED
  Points: 100
  Approved by: Dr. Sarah Chen

(Can scroll to see more history)

SUMMARY STATS AT TOP:
  - This Month: 6 tasks completed, 250 points
  - This Year: 47 tasks completed, 2,840 points
  - Avg Completion Time: 8.3 days
```

#### Page 3: Approvals Status
**URL:** `/approvals-status`

```
HEADER: "My Approvals Status"

PENDING APPROVALS (2):

Approval 1: "Grade Midterm Exams" 
  Status: PENDING (submitted 2 hours ago)
  Submitted To: Dr. Sarah Chen (HOD)
  Message: "Submitted 100 grades. Average score: 78%"
  Timeline: Shows "2 hours pending"
  Expected: "Response in 1-2 days"
  Badge: "PENDING" (orange)

Approval 2: "Research Paper Review"
  Status: PENDING (submitted 5 days ago)
  Submitted To: Dr. Sarah Chen (HOD)
  Message: "Reviewed 5 papers. Feedback provided"
  Timeline: Shows "5 days pending" (red warning - slow)
  Expected: "Awaiting review"
  Badge: "DELAYED" (red)
  Option: [FOLLOW UP] - sends notification

APPROVED APPROVALS (Recent):

Jan 20: "Student Mentoring Sessions"
  Status: APPROVED
  Points: 80
  Approved By: Dr. Sarah Chen
  Timeline: "Took 1 day"

Jan 15: "Lab Assignment Creation"
  Status: APPROVED
  Points: 60
  Approved By: Dr. Sarah Chen
  Timeline: "Took 2 days"

REJECTED APPROVALS (if any):

(Show in separate section if any rejections exist)
```

---

## PART 6: LOADING & ERROR STATES

### Loading States (All pages)
```
DEFAULT: Show skeleton loaders for 1.5 seconds
  - Skeleton cards (placeholder boxes)
  - Fade in animation
  - Then show real content

FILE UPLOADS: Show progress bar
  "Uploading... 45%"
  Then: "Upload complete"

ACTIONS (Approval, Submit, etc):
  Show spinner in button
  Button disabled
  After 1.2 seconds: Success toast
  "Task approved successfully"
```

### Error States
```
NETWORK ERROR:
  Title: "Connection Error"
  Message: "Failed to load data. Check internet."
  Button: [RETRY]
  
EMPTY STATES:
  Title: "No tasks yet"
  Message: "You haven't been assigned any tasks"
  Icon: Empty inbox icon (One UI design)
  Button: [CREATE NEW]
  
VALIDATION ERROR:
  Title: "Invalid Input"
  Message: "Please enter a valid email"
  Field: Highlighted in red
```

---

## PART 7: INTERACTIONS & MICRO-ANIMATIONS

### Transitions
```
- Page navigation: Fade in/out (200ms)
- Card hover: Slight lift + shadow (300ms)
- Button click: Scale down 2% (100ms)
- Toast: Slide in from right (300ms)
- Approve action: Confetti animation + toast
```

### Data Persistence
```
Every action stores to localStorage:
  localStorage.setItem('mockData', JSON.stringify(updatedData))
  
On page reload:
  Check localStorage for data
  If exists: Use it (user's changes persisted)
  If not: Load default mock data
  
Session expires after 24 hours (set expiry timestamp)
On expiry: Redirect to login, show "Session expired"
```

---

## PART 8: GENERIC TEMPLATE STRUCTURE

**Same architecture, but different domain:**

```
ROLES:
1. Executive (Like Director)
2. Team Lead (Like HOD)
3. Finance Manager (Like Financial Head)
4. Developer/Team Member (Like Faculty)

PAGES (Similar hierarchy):

EXECUTIVE:
  - Dashboard (Company-wide metrics)
  - Organization Chart (All teams, structure)
  - Financial Overview (Budget, expenses)

TEAM LEAD:
  - Dashboard (Team metrics)
  - Team View (Team members, projects)
  - Approvals (Project approvals)

DEVELOPER:
  - My Tasks (Assigned work)
  - Task History (Completed work)
  - Approvals Status (Pending approvals)

TERMINOLOGY SWAP:
  Faculty → Developer
  Task → Assignment/Bug/Feature
  Department → Team
  HOD → Team Lead
  Director → Executive/CTO/CEO
  Grades → Code Review
  Students → Teammates
```

---

## PART 9: ONE UI DESIGN SYSTEM (Apply throughout)

```
PRIMARY COLOR: #8F7AFF (purple)
  - Buttons, links, headers, badges
  - Hover: #8644D7 (darker purple)

ACCENT CYAN: #00D4FF (Galaxy AI)
  - Important highlights, special features

ACCENT YELLOW: #FFD700 (warnings)
  - Pending items, alerts, deadlines approaching

SEMANTICS:
  Success: #24C856 (green) - Approved, completed
  Error: #FF3B30 (red) - Rejected, failed
  Info: #64B5F6 (blue) - Neutral info

TYPOGRAPHY: One UI Sans (variable weight)
  Title: 36px Bold
  Heading: 24px Semi-bold
  Subheading: 18px Medium
  Body: 14px Regular
  Small: 12px Regular

SPACING: 8px, 16px, 24px, 32px (multiples of 8)
BORDER RADIUS: 12px standard, 24px for large elements
SHADOWS: Subtle drop shadows on cards
```

---

## PART 10: TESTING CHECKLIST (Demo quality)

**Before launching:**

- [ ] Login works without DB (mock only)
- [ ] Signup works without DB (mock only)
- [ ] Session persists on page reload
- [ ] All 4 roles load correct pages
- [ ] All pages have loading states (1-2 seconds)
- [ ] All buttons have hover/active states
- [ ] Error states display properly
- [ ] Empty states show when no data
- [ ] Sidebar changes based on role
- [ ] Colors use One UI palette (no hardcoded)
- [ ] Font is One UI Sans (variable)
- [ ] Responsive on mobile (max-width: 640px)
- [ ] All animations smooth (no janky transitions)
- [ ] localStorage saves on every action
- [ ] Can reset data (localStorage.clear())
- [ ] Toast notifications show on all key actions
- [ ] No console errors
- [ ] Page titles update correctly
- [ ] Breadcrumbs show navigation
- [ ] Help tooltips on complex elements

---

## SUMMARY FOR AGENT

**Start building from this spec. Key points:**

1. NO DATABASE - Everything in localStorage
2. FEELS REAL - Loading states, animations, delays
3. HARDCODED but realistic - Real names, numbers, dates
4. ROLE-BASED NAVIGATION - Each role gets different pages
5. ONE UI DESIGN - #8F7AFF primary, cyan accents, One UI Sans font
6. COLLEGE + GENERIC - Two separate flows, same architecture
7. PRODUCTION QUALITY - Error states, empty states, three-state pattern

You're building a high-fidelity mockup that feels like a real SaaS app.
No shortcuts. No placeholder text. Make it feel professional and real.

When agent says "Done", it should be shareable as a real product demo.
Demo to your sir by switching roles (different emails trigger different pages).
Show loading states, animations, realistic data. Show like it's real.

**That's it. Build this. No database. Full localStorage persistence.**
