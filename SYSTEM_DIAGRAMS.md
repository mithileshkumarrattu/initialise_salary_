# System Architecture & UML Diagrams

**For deep understanding of WorkToken system design**

---

## 1. CLASS DIAGRAM - Data Model

```
┌─────────────────────────────────────┐
│            USER                      │
├─────────────────────────────────────┤
│ - id: UUID                          │
│ - email: String                     │
│ - password_hash: String             │
│ - role: Enum                        │
│ - department_id: FK                 │
│ - token_balance: Decimal            │
│ - progress_percentage: Decimal      │
│ - created_at: Timestamp             │
│ - updated_at: Timestamp             │
├─────────────────────────────────────┤
│ + getProgress(): Decimal            │
│ + getTokenBalance(): Decimal        │
│ + canInitiateSalaryTransfer(): Bool │
│ + getRole(): Enum                   │
└─────────────────────────────────────┘
          ▲         ▲         ▲
          │         │         │
      ┌───┴─────┬───┴──────┬──┴───────┐
      │ DIRECTOR│ HOD      │ FACULTY   │ FINANCE
      
┌──────────────────────────────────────────┐
│        STRUCTURED_TASK                    │
│  (Classes, Fixed Work)                   │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - faculty_id: FK → USER                  │
│ - department_id: FK → DEPARTMENT         │
│ - subject: String                        │
│ - credits: Decimal                       │
│ - scheduled_at: Timestamp                │
│ - duration_minutes: Int                  │
│ - room_location: String                  │
│ - max_capacity: Int                      │
│ - attendance_marked: Boolean             │
│ - attendance_marked_at: Timestamp        │
│ - semester_id: FK → SEMESTER             │
├──────────────────────────────────────────┤
│ + markAttendance(): void                 │
│ + getAttendancePercentage(): Decimal     │
│ + getCreditsValue(): Decimal             │
└──────────────────────────────────────────┘
          │
          └────────────────────────┐
                                   │
┌──────────────────────────────────────────┐
│        UNSTRUCTURED_TASK                  │
│  (Mentoring, Events, Projects)           │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - posted_by_id: FK → USER (HOD)          │
│ - department_id: FK → DEPARTMENT         │
│ - title: String                          │
│ - description: Text                      │
│ - token_value: Decimal                   │
│ - max_nominees: Int                      │
│ - status: Enum                           │
│   [OPEN, IN_PROGRESS, COMPLETED]         │
│ - deadline: Timestamp                    │
│ - required_proof: String (description)   │
│ - created_at: Timestamp                  │
├──────────────────────────────────────────┤
│ + getNomineeCount(): Int                 │
│ + selectWinner(user_id): void            │
│ + submitProof(proof: File): void         │
│ + approveProof(): void                   │
│ + rejectProof(reason: String): void      │
│ + distributeTokens(): void               │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        TASK_NOMINATION                    │
│  (Faculty applies for unstructured task) │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - task_id: FK → UNSTRUCTURED_TASK        │
│ - faculty_id: FK → USER                  │
│ - status: Enum                           │
│   [PENDING_HOD_REVIEW, ASSIGNED,         │
│    PROOF_SUBMITTED, COMPLETED,           │
│    REJECTED]                             │
│ - nomination_message: Text               │
│ - hod_selection_reason: Text             │
│ - proof_submission: File/URL             │
│ - proof_submitted_at: Timestamp          │
│ - hod_approval: Boolean                  │
│ - hod_feedback: Text                     │
│ - nominated_at: Timestamp                │
│ - assigned_at: Timestamp                 │
│ - completed_at: Timestamp                │
├──────────────────────────────────────────┤
│ + submit(): void                         │
│ + submitProof(proof: File): void         │
│ + approve(): void                        │
│ + reject(reason: String): void           │
│ + awardTokens(): void                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        TOKEN                              │
│  (Token balance tracking)                │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - user_id: FK → USER                     │
│ - balance: Decimal                       │
│ - source: Enum                           │
│   [DIRECTOR_MINT, STRUCTURED_CREDIT,     │
│    UNSTRUCTURED_CREDIT, TRANSFER_IN,     │
│    TRANSFER_OUT, LOAN]                   │
│ - task_id: FK → STRUCTURED_TASK/UNSTRUCTURED
│ - updated_at: Timestamp                  │
├──────────────────────────────────────────┤
│ + addTokens(amount: Decimal): void       │
│ + removeTokens(amount: Decimal): void    │
│ + getBalance(): Decimal                  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        SALARY_TRANSFER                    │
│  (Token to fiat conversion request)      │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - faculty_id: FK → USER                  │
│ - amount_tokens: Decimal                 │
│ - status: Enum                           │
│   [INITIATED, HOD_APPROVED,              │
│    FINANCE_APPROVED, COMPLETED, REJECTED]│
│ - hod_approval_at: Timestamp             │
│ - hod_approved_by: FK → USER             │
│ - finance_approval_at: Timestamp         │
│ - finance_approved_by: FK → USER         │
│ - tx_hash: String (blockchain)           │
│ - bank_transfer_ref: String              │
│ - created_at: Timestamp                  │
│ - completed_at: Timestamp                │
├──────────────────────────────────────────┤
│ + initiate(): void                       │
│ + approveByHod(): void                   │
│ + approveByFinance(): void               │
│ + executeSalaryTransfer(): void          │
│ + recordBlockchainTx(hash): void         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        DEPARTMENT                         │
├──────────────────────────────────────────┤
│ - id: UUID                               │
│ - name: String                           │
│ - hod_id: FK → USER                      │
│ - faculty_count: Int                     │
│ - budget_tokens: Decimal                 │
│ - spent_tokens: Decimal                  │
├──────────────────────────────────────────┤
│ + getAverageProgress(): Decimal          │
│ + getBudgetRemaining(): Decimal          │
│ + getFacultyList(): USER[]               │
└──────────────────────────────────────────┘
```

---

## 2. STATE DIAGRAM - Faculty Journey

```
┌───────────────────────────────────────────────────────────────┐
│ FACULTY PROGRESS STATE MACHINE                               │
│ From Login to Salary Receipt                                 │
└───────────────────────────────────────────────────────────────┘

         ┌─────────────────┐
         │   USER LOGIN    │
         │   (All roles)   │
         └────────┬────────┘
                  │
    ╔═════════════╩═════════════╗
    ║  Role Detection Middleware ║
    ╚═════════════╦═════════════╝
                  │
         ┌────────▼────────┐
         │ ROLE = FACULTY? │ ← YES
         └────────┬────────┘
                  │
    ┌─────────────┴──────────────────────┐
    │                                    │
    ▼                                    ▼
┌──────────────────┐         ┌──────────────────┐
│ FACULTY DASHBOARD│         │ OTHER DASHBOARDS │
│ Initial state    │         │ (HOD/DIR/FIN)    │
└────────┬─────────┘         └──────────────────┘
         │
         │ Progress % = (Structured % × 0.7) + (Unstructured % × 0.3)
         │
         ├─ Structured: Attendance in scheduled classes
         │              └─ Counted as % of total classes in semester
         │
         └─ Unstructured: Nominated & completed tasks
                          └─ Counted as % of available tasks
    
    ┌────────────────────────────────────────────────────────┐
    │ DAILY WORKFLOW - Faculty Dashboard                     │
    └────────────────────────────────────────────────────────┘
    
    START_OF_DAY
         │
         ├─► OPTION A: MARK ATTENDANCE (Structured Work)
         │    │
         │    ├─► Check scheduled classes
         │    │
         │    ├─► For each class today:
         │    │    ├─ Click "Mark Present"
         │    │    ├─ Save attendance_marked = true
         │    │    └─ Recalculate: Attended / Total Classes = Structured %
         │    │
         │    └─► Update progress % = (new Structured % × 0.7) + (Unstructured % × 0.3)
         │
         ├─► OPTION B: NOMINATE FOR TASK (Unstructured Work)
         │    │
         │    ├─► Browse task pool (status = OPEN)
         │    │
         │    ├─► Click "Nominate" on selected task
         │    │    ├─ Create TaskNomination record
         │    │    ├─ Status = PENDING_HOD_REVIEW
         │    │    └─ Wait for HOD to review
         │    │
         │    ├─► HOD reviews all nominations for this task
         │    │    ├─ Selects 1-3 best nominees
         │    │    ├─ Updates status = ASSIGNED
         │    │    └─ Sends notification to faculty
         │    │
         │    ├─► Faculty selected for task:
         │    │    ├─ Complete the work
         │    │    ├─ Click "Submit Proof" (photo/doc/report)
         │    │    ├─ Status = PROOF_SUBMITTED
         │    │    └─ Await HOD review of proof
         │    │
         │    ├─► HOD reviews proof:
         │    │    ├─ If approved:
         │    │    │  ├─ Status = COMPLETED
         │    │    │  ├─ Award tokens_value to faculty
         │    │    │  └─ Recalculate Unstructured % = Completed Tasks / Total Tasks Available
         │    │    │
         │    │    └─ If rejected:
         │    │       ├─ Status = PROOF_REJECTED
         │    │       ├─ Send feedback to faculty
         │    │       └─ Faculty can nominate again for another task
         │    │
         │    └─► Update progress % = (Structured % × 0.7) + (new Unstructured % × 0.3)
         │
         └─► Check progress % after each action
    
    
    ┌────────────────────────────────────────────────────────┐
    │ SALARY TRANSFER STATE MACHINE                          │
    └────────────────────────────────────────────────────────┘
    
    Progress % < 85%
         │
         ├─► Button HIDDEN: "Initiate Salary Transfer"
         │
         └─► Faculty cannot transfer
    
    
    Progress % >= 85%  ◄─── THRESHOLD MET
         │
         ├─► Button VISIBLE: "Initiate Salary Transfer"
         │
         ├─► Faculty clicks button
         │    │
         │    ├─► Confirmation dialog appears
         │    │    "Are you sure? This will initiate salary transfer for approval."
         │    │
         │    ├─► On CONFIRM:
         │    │    ├─ Create SALARY_TRANSFER record
         │    │    ├─ Status = INITIATED
         │    │    ├─ Send to HOD for approval
         │    │    └─ Faculty sees: "Transfer pending HOD approval"
         │    │
         │    └─► On CANCEL:
         │         └─ Dialog closes, nothing changes
         │
         └─► HOD receives notification
              │
              ├─► HOD logs in → goes to Approvals section
              │
              ├─► HOD reviews transfer:
              │    ├─ Checks progress % calculation
              │    ├─ Checks all supporting documents
              │    └─ Can see: class attendance, completed tasks, token balance
              │
              ├─► HOD approves:
              │    ├─ Status = HOD_APPROVED
              │    ├─ Timestamp: hod_approval_at
              │    ├─ Send to Finance for final approval
              │    └─ Faculty sees: "Transfer pending Finance approval"
              │
              ├─► HOD rejects:
              │    ├─ Status = REJECTED
              │    ├─ Send feedback to faculty
              │    ├─ Faculty can resubmit after reaching 85% again
              │    └─ Faculty sees: "Transfer rejected. Reason: [feedback]"
              │
              └─► Finance receives notification
                   │
                   ├─► Finance logs in → goes to Finance dashboard
                   │
                   ├─► Finance reviews transfer:
                   │    ├─ Verifies HOD approval
                   │    ├─ Checks token balance in blockchain
                   │    ├─ Verifies bank account details
                   │    └─ Can see: full audit trail
                   │
                   ├─► Finance approves:
                   │    ├─ Status = FINANCE_APPROVED
                   │    ├─ Calls smart contract
                   │    ├─ Executes token transfer from Director wallet
                   │    ├─ Records tx_hash (immutable blockchain record)
                   │    ├─ Status = COMPLETED
                   │    ├─ Initiates bank transfer for fiat salary
                   │    └─ Faculty sees: "Salary transferred! Check your bank account."
                   │
                   └─► Finance rejects:
                        ├─ Status = REJECTED
                        ├─ Send feedback (reason)
                        └─ Faculty needs to reapply


    ┌──────────────────┐
    │ SALARY RECEIVED  │
    │ [END STATE]      │
    └──────────────────┘
```

---

## 3. SEQUENCE DIAGRAM - Mark Attendance Flow

```
Faculty              Frontend              Backend              Database         Blockchain
  │                    │                    │                    │                 │
  │ Load Dashboard     │                    │                    │                 │
  ├───────────────────►│                    │                    │                 │
  │                    │ GET /api/dashboard │                    │                 │
  │                    ├───────────────────►│                    │                 │
  │                    │                    │ SELECT * FROM      │                 │
  │                    │                    │ structured_tasks   │                 │
  │                    │                    ├───────────────────►│                 │
  │                    │                    │◄───────────────────┤                 │
  │                    │◄───────────────────┤ [classes for today]                 │
  │ [See today's       │                    │                    │                 │
  │  classes]          │                    │                    │                 │
  │◄───────────────────┤                    │                    │                 │
  │                    │                    │                    │                 │
  │ Click "Mark        │                    │                    │                 │
  │  Present" on       │                    │                    │                 │
  │  Math 101          │                    │                    │                 │
  ├───────────────────►│                    │                    │                 │
  │                    │ PATCH              │                    │                 │
  │                    │ /api/attendance/   │                    │                 │
  │                    │ {classId, marked}  │                    │                 │
  │                    ├───────────────────►│                    │                 │
  │                    │                    │ UPDATE             │                 │
  │                    │                    │ structured_tasks   │                 │
  │                    │                    │ SET attendance_    │                 │
  │                    │                    │ marked = true      │                 │
  │                    │                    ├───────────────────►│                 │
  │                    │                    │◄───────────────────┤                 │
  │                    │                    │                    │                 │
  │                    │                    │ CALCULATE:         │                 │
  │                    │                    │ attended = 7       │                 │
  │                    │                    │ total = 10         │                 │
  │                    │                    │ attended% = 70%    │                 │
  │                    │                    │                    │                 │
  │                    │                    │ UPDATE users       │                 │
  │                    │                    │ SET progress_pct = │                 │
  │                    │                    │ (70% × 0.7) +      │                 │
  │                    │                    │ (60% × 0.3) = 68%  │                 │
  │                    │                    ├───────────────────►│                 │
  │                    │                    │◄───────────────────┤                 │
  │                    │ {success: true,    │                    │                 │
  │                    │  newProgress: 68}  │                    │                 │
  │                    │◄───────────────────┤                    │                 │
  │ [Checkbox marks    │                    │                    │                 │
  │  green]            │                    │                    │                 │
  │ [Progress Ring     │                    │                    │                 │
  │  updates to 68%]   │                    │                    │                 │
  │◄───────────────────┤                    │                    │                 │
  │ [Still below 85%]  │                    │                    │                 │
  │ [Button still      │                    │                    │                 │
  │  hidden]           │                    │                    │                 │
  │                    │                    │                    │                 │
```

---

## 4. SEQUENCE DIAGRAM - Initiate Salary Transfer

```
Faculty              Frontend              Backend              Database         Smart Contract
  │                    │                    │                    │                   │
  │ Progress = 90%     │                    │                    │                   │
  │ Clicks "Transfer   │                    │                    │                   │
  │  Salary" button    │                    │                    │                   │
  ├───────────────────►│                    │                    │                   │
  │                    │ [Show confirmation │                    │                   │
  │                    │  dialog with blur] │                    │                   │
  │                    │ "Are you sure?"    │                    │                   │
  │◄───────────────────┤ [Yes] [No]         │                    │                   │
  │                    │                    │                    │                   │
  │ Clicks "Yes"       │                    │                    │                   │
  ├───────────────────►│                    │                    │                   │
  │                    │ POST /api/salary/  │                    │                   │
  │                    │ initiate           │                    │                   │
  │                    ├───────────────────►│                    │                   │
  │                    │                    │ INSERT INTO        │                   │
  │                    │                    │ salary_transfers   │                   │
  │                    │                    │ {faculty_id,       │                   │
  │                    │                    │  amount_tokens,    │                   │
  │                    │                    │  status:'INITIATED'}
  │                    │                    ├───────────────────►│                   │
  │                    │                    │◄───────────────────┤                   │
  │                    │ {success: true}    │                    │                   │
  │                    │◄───────────────────┤                    │                   │
  │ [Toast: "Transfer │                    │                    │                   │
  │  initiated!"]      │                    │                    │                   │
  │ [Button disabled]  │                    │                    │                   │
  │◄───────────────────┤                    │                    │                   │
  │                    │                    │                    │                   │
  │ [Sees "Pending     │                    │                    │                   │
  │  HOD Approval"]    │                    │                    │                   │
  │                    │                    │                    │                   │
  │                    │                    │ SEND NOTIFICATION  │                   │
  │                    │                    │ TO HOD             │                   │
  │                    │                    │ "Faculty requesting│                   │
  │                    │                    │  salary transfer"  │                   │
  │                    │                    │                    │                   │
  ├═══════════════════► HOD notified ◄═════════════════════════════════════════════════╛
  │
  
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │ [Later] HOD Reviews & Approves                                                  │
  └─────────────────────────────────────────────────────────────────────────────────┘
  
  HOD                  Frontend              Backend              Database         
   │                    │                    │                    │                 
   │ Logs in            │                    │                    │                 
   ├───────────────────►│                    │                    │                 
   │                    │ GET /api/approvals │                    │                 
   │                    ├───────────────────►│                    │                 
   │                    │                    │ SELECT *           │                 
   │                    │                    │ FROM salary_       │                 
   │                    │                    │ transfers WHERE    │                 
   │                    │                    │ status='INITIATED' │                 
   │                    │                    ├───────────────────►│                 
   │                    │ [Salary Transfer   │◄───────────────────┤                 
   │                    │  Pending list]     │                    │                 
   │◄───────────────────┤                    │                    │                 
   │ [Sees Faculty's    │                    │                    │                 
   │  transfer request] │                    │                    │                 
   │                    │                    │                    │                 
   │ Clicks "Approve"   │                    │                    │                 
   ├───────────────────►│                    │                    │                 
   │                    │ PATCH /api/        │                    │                 
   │                    │ salary-transfers/  │                    │                 
   │                    │ {id, approved:true}│                    │                 
   │                    ├───────────────────►│                    │                 
   │                    │                    │ UPDATE             │                 
   │                    │                    │ salary_transfers   │                 
   │                    │                    │ SET status =       │                 
   │                    │                    │ 'HOD_APPROVED'     │                 
   │                    │                    ├───────────────────►│                 
   │                    │ {success: true}    │◄───────────────────┤                 
   │                    │◄───────────────────┤                    │                 
   │ [Toast: "Approved"]│                    │                    │                 
   │ [Removed from      │                    │ SEND NOTIFICATION  │                 
   │  pending list]     │                    │ TO FINANCE:        │                 
   │◄───────────────────┤                    │ "Approved transfer"│                 
   │                    │                    │                    │                 
   ├═════════════════════════════════════════════════════════════════════════════════╛
   │
   
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │ [Later] Finance Reviews & Executes Smart Contract                               │
  └─────────────────────────────────────────────────────────────────────────────────┘
  
  Finance              Frontend              Backend              Database      Smart Contract
   │                    │                    │                    │                  │
   │ Logs in            │                    │                    │                  │
   ├───────────────────►│                    │                    │                  │
   │                    │ GET /api/          │                    │                  │
   │                    │ finance-approvals  │                    │                  │
   │                    ├───────────────────►│                    │                  │
   │                    │                    │ SELECT * FROM      │                  │
   │                    │                    │ salary_transfers   │                  │
   │                    │                    │ WHERE status=      │                  │
   │                    │                    │ 'HOD_APPROVED'     │                  │
   │                    │ [Pending transfers]│◄───────────────────┤                  │
   │                    │◄───────────────────┤                    │                  │
   │ [Sees transfer]    │                    │                    │                  │
   │ [Reviews data]     │                    │                    │                  │
   │                    │                    │                    │                  │
   │ Clicks "Release    │                    │                    │                  │
   │  Salary"           │                    │                    │                  │
   ├───────────────────►│                    │                    │                  │
   │                    │ POST /api/         │                    │                  │
   │                    │ execute-transfer   │                    │                  │
   │                    ├───────────────────►│                    │                  │
   │                    │                    │ CALL Smart Contract│                  │
   │                    │                    │ transferSalary()   │                  │
   │                    │                    ├──────────────────────────────────────►│
   │                    │                    │                    │  Execute transfer│
   │                    │                    │                    │  Director → Faculty
   │                    │                    │                    │ [Emit log]       │
   │                    │◄──────────────────────────────────────────────────────────┤
   │                    │                    │ tx_hash: "0x1234..."                  │
   │                    │                    │                    │                  │
   │                    │                    │ UPDATE             │                  │
   │                    │                    │ salary_transfers   │                  │
   │                    │                    │ SET status=        │                  │
   │                    │                    │ 'COMPLETED',       │                  │
   │                    │                    │ tx_hash='0x1234'   │                  │
   │                    │                    ├───────────────────►│                  │
   │                    │ {success: true}    │◄───────────────────┤                  │
   │                    │◄───────────────────┤                    │                  │
   │ [Toast: "Salary    │                    │ SEND NOTIFICATION  │                  │
   │  transferred!"]    │                    │ TO FACULTY:        │                  │
   │                    │                    │ "Salary received!" │                  │
   │◄───────────────────┤                    │                    │                  │
   │                    │                    │                    │                  │
   ├═══════════════════► Faculty notified ◄═════════════════════════════════════════╛
```

---

## 5. COMMUNICATION DIAGRAM - Multi-Role Approval Chain

```
         ┌─────────────────────────────────────────────────────────┐
         │ WORKTOKEN APPROVAL CHAIN - Multi-Role Communication    │
         └─────────────────────────────────────────────────────────┘

                            DIRECTOR
                          (1 person)
                              │
                              │ Mints tokens
                              │ Sets budget
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                HOD LAYER           FINANCE LAYER
            (10 departments)        (2-3 people)
                │                       │
        ┌───────┼───────┬───────┐      │
        │       │       │       │      │
        ▼       ▼       ▼       ▼      ▼
      DEPT1   DEPT2   DEPT3  ...DEPT10 Finance
      HOD     HOD     HOD     HOD      Team
        │       │       │       │      │
        │ OWNS  │ OWNS  │ OWNS  │ OWNS │
        │       │       │       │      │
    ┌───┴──┬────┴──┬────┴──┬────┴──┐   │
    │ Fac1 │ Fac2 │ Fac3 │ Fac4 │   │  REVIEWS
    │      │      │      │      │   │  ALL
    └──────┴──────┴──────┴──────┘   │  TRANSFERS
                                    │
    ╔═══════════════════════════════╩════════════════╗
    ║  APPROVAL WORKFLOW MESSAGES                   ║
    ╚═══════════════════════════════╦════════════════╝

1. DIRECTOR → HOD
   "Mint complete. Budget: 50,000 tokens"

2. HOD → FACULTY
   "Teach these classes, complete these tasks"
   (Posts tasks for faculty to nominate)

3. FACULTY → HOD
   "Nominating for Task X: [reason]"
   (Nomination request)

4. HOD → FACULTY (some selected)
   "You're assigned to Task X"
   (Acceptance notification)

5. FACULTY → HOD
   "Task X complete, proof: [submission]"
   (Proof submission)

6. HOD → FACULTY
   "Task approved! +50 tokens"
   (Approval notification)

7. FACULTY → HOD
   "Progress: 90%, Initiating salary transfer"
   (Transfer initiation)

8. HOD → FINANCE
   "Faculty transfer approved, verify & release"
   (Forwarding to finance)

9. FINANCE → SMART CONTRACT
   "Transfer 1000 tokens from Director to Faculty"
   (Blockchain execution)

10. SMART CONTRACT → FINANCE
    "Transfer complete: tx_hash=0x1234"
    (Immutable confirmation)

11. FINANCE → FACULTY
    "Salary transferred! Check bank account"
    (Fiat payment notification)

12. FINANCE → DIRECTOR
    "Salary released: 1000 tokens to Faculty1"
    (Reporting)

    ╔═════════════════════════════════╗
    ║ IMMUTABLE AUDIT TRAIL           ║
    ║ Every step logged in database & ║
    ║ blockchain for verification     ║
    ╚═════════════════════════════════╝
```

---

## 6. ACTIVITY DIAGRAM - Complete Task Completion

```
┌─────────────────────────────────────────────────────────────┐
│ UNSTRUCTURED TASK COMPLETION ACTIVITY FLOW                 │
└─────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌──────────────────────────────┐
│ HOD Posts Task               │
│ Title: "Placement Drive"     │
│ Token Value: 100             │
│ Max Nominees: 3              │
│ Deadline: 2025-01-15         │
│ Status: OPEN                 │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────┐
        │ Wait for     │
        │ nominations  │
        │ (up to date) │
        └──────┬───────┘
               │
               ├─► [Faculty1 nominates]
               │   + [Faculty2 nominates]
               │   + [Faculty3 nominates]
               │   + [Faculty4 nominates]
               │
               └─► 4 total nominees
                   Status: NOMINATED
                   HOD receives notification
               
               ▼
        ┌──────────────────────────┐
        │ HOD Reviews Nominations  │
        │ Reads all applications   │
        │ Selects 3 best fit:      │
        │ - Faculty1 ✓ Selected    │
        │ - Faculty2 ✓ Selected    │
        │ - Faculty3 ✓ Selected    │
        │ - Faculty4 ✗ Not selected│
        └──────┬───────────────────┘
               │
               ├─► Faculty1 → Status: ASSIGNED
               │   + Notification: "You're assigned!"
               │
               ├─► Faculty2 → Status: ASSIGNED
               │   + Notification: "You're assigned!"
               │
               ├─► Faculty3 → Status: ASSIGNED
               │   + Notification: "You're assigned!"
               │
               └─► Faculty4 → Status: PENDING (can nominate for another)
                   + Notification: "Not selected this time"
               
               ▼
        ┌──────────────────────────┐
        │ Faculty Complete Work    │
        │                          │
        │ Faculty1:                │
        │ - Organizes placement    │
        │ - Takes photos           │
        │ - Collects attendance    │
        │ [Deadline: 2025-01-15]   │
        └──────┬───────────────────┘
               │
        [Deadline approaches]
               │
               ▼
        ┌──────────────────────────────┐
        │ Faculty Submits Proof        │
        │ - Photos (5 MB)              │
        │ - Report (PDF)               │
        │ - Attendance list            │
        │ Status: PROOF_SUBMITTED      │
        │ HOD notified                 │
        └──────┬───────────────────────┘
               │
               ▼
        ┌──────────────────────────────┐
        │ HOD Reviews Proof            │
        │ Checks:                      │
        │ ✓ Event actually happened    │
        │ ✓ Documentation complete     │
        │ ✓ Quality meets standards    │
        └──────┬───────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ┌────────┐   ┌─────────────┐
    │APPROVE │   │   REJECT    │
    └────┬───┘   └─────┬───────┘
         │             │
         ▼             ▼
    ┌──────────┐   ┌──────────────────┐
    │Status:   │   │Status:           │
    │COMPLETED │   │PROOF_REJECTED    │
    │          │   │                  │
    │Award:    │   │Feedback: "Add    │
    │+100 tokens   │more documentation"
    │to Faculty1   │                  │
    │          │   │Faculty can resubmit
    │Recalculate│  │or nominate for  │
    │Faculty1   │  │another task     │
    │progress%: │  │                 │
    │Unstr% ↑   │  │                 │
    │Overall% ↑ │  │                 │
    └──────┬───┘   └──────┬───────────┘
         │             │
         ▼             ▼
    ┌──────────┐   ┌──────────────┐
    │ Faculty1 │   │ Faculty 2,3 │
    │ Progress │   │ Can submit  │
    │ updated  │   │ proof if    │
    │ Notified │   │ they also   │
    │ of award │   │ completed   │
    └──────┬───┘   └──────┬───────┘
           │             │
           ▼             ▼
     [Wait for other faculty to complete/submit]
           │             │
           └─────┬───────┘
                 │
        ┌────────▼──────────┐
        │ All Faculty:      │
        │ Faculty 1: +100   │
        │ Faculty 2: +100   │
        │ Faculty 3: +100   │
        │ Tokens awarded    │
        │ Progress updated  │
        │ Task Status:      │
        │ COMPLETED         │
        └────────┬──────────┘
                 │
                 ▼
              [END]
```

---

## 7. DEPLOYMENT DIAGRAM - Architecture

```
┌───────────────────────────────────────────────────────────────┐
│ WORKTOKEN PLATFORM - DEPLOYMENT ARCHITECTURE                │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         CLIENT LAYER                     │
│ (Web Browsers - Faculty/HOD/Dir/Fin)    │
├─────────────────────────────────────────┤
│ • Faculty Portal                        │
│ • HOD Dashboard                         │
│ • Director Analytics                    │
│ • Finance Release Panel                 │
│ (Single codebase, role-based routing)  │
└────────────────────┬────────────────────┘
                     │ HTTPS/WSS
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│ NEXT.JS 16 SERVER    │  │ WEBSOCKET SERVER     │
│ (App Router)         │  │ (Real-time updates) │
├──────────────────────┤  ├──────────────────────┤
│ • Route Handlers     │  │ • Notifications      │
│ • Server Actions     │  │ • Progress tracking  │
│ • Middleware Auth    │  │ • Live approvals     │
│ • API Endpoints      │  │                      │
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           └────────────┬────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │ AUTHENTICATION LAYER          │
        │ (Better Auth / JWT)           │
        ├───────────────────────────────┤
        │ • Session management          │
        │ • Role-based access control   │
        │ • Token verification          │
        └────────────┬──────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │ DATABASE LAYER                  │
        │ (Neon PostgreSQL / Supabase)   │
        ├─────────────────────────────────┤
        │ Tables:                         │
        │ • users (role, progress)        │
        │ • departments                   │
        │ • structured_tasks (classes)    │
        │ • unstructured_tasks            │
        │ • task_nominations              │
        │ • tokens (balance tracking)     │
        │ • salary_transfers (approval)   │
        │ • audit_logs (immutable)        │
        └──────┬────────────────────┬─────┘
               │                    │
               ▼                    ▼
        ┌────────────┐      ┌──────────────┐
        │ Query      │      │ Row Level    │
        │ Optimization       │ Security    │
        │ (caching)  │      │ (RLS)        │
        └────────────┘      └──────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌────────────────────┐  ┌────────────────────────┐
│ BLOCKCHAIN LAYER   │  │ EXTERNAL SERVICES      │
│ (Ethereum/Polygon) │  │                        │
├────────────────────┤  ├────────────────────────┤
│ • Token wallet     │  │ • Email notifications  │
│ • Smart contract   │  │ • SMS alerts           │
│ • Transfer logs    │  │ • Payment gateway      │
│ • Immutable audit  │  │ • Audit export        │
│                    │  │                        │
│ tx_hash saved in:  │  │                        │
│ salary_transfers   │  │                        │
│ table for proof    │  │                        │
└────────────────────┘  └────────────────────────┘
```

---

## 8. ENTITY RELATIONSHIP DIAGRAM (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│  WORKTOKEN DATABASE - ER DIAGRAM                           │
└─────────────────────────────────────────────────────────────┘

                           USERS
                    ┌──────────────────┐
                    │ id (PK)          │
                    │ email            │
                    │ role (enum)      │
                    │ dept_id (FK)     │
                    │ progress %       │
                    │ token_balance    │
                    └────┬──────────┬──┘
                         │          │
                    ┌────┘    ┌─────┘
                    │         │
        ┌───────────▼─┐  ┌────▼──────────┐
        │DEPARTMENTS  │  │ STRUCTURED    │
        ├─────────────┤  │ TASKS         │
        │id (PK)      │  ├───────────────┤
        │name         │  │id (PK)        │
        │hod_id (FK)  │  │faculty_id(FK) │
        │budget_tokens    │dept_id (FK)  │
        └─────────────┘  │subject        │
                         │attendance_    │
                         │marked (bool)  │
                         └────┬──────────┘
                              │
                              │ 1 faculty
                              │ can teach
                              │ many classes
                              │

    ┌───────────────────────────────────────────┐
    │UNSTRUCTURED_TASKS                         │
    ├───────────────────────────────────────────┤
    │id (PK)                                    │
    │posted_by_id (FK → users HOD)             │
    │title                                      │
    │token_value                                │
    │status (OPEN/IN_PROG/COMPLETED)           │
    │max_nominees                               │
    └────┬──────────────────────────────────┬──┘
         │                                  │
         │ 1 task                           │ 1 task
         │ many nominations                 │ many faculty
         │                                  │
    ┌────▼──────────────────────────────────▼────┐
    │ TASK_NOMINATIONS (Junction Table)          │
    ├────────────────────────────────────────────┤
    │ id (PK)                                    │
    │ task_id (FK)                               │
    │ faculty_id (FK)                            │
    │ status (PENDING/ASSIGNED/COMPLETED)        │
    │ proof_submission (file URL)                │
    │ hod_approval (bool)                        │
    │ nominated_at (timestamp)                   │
    │ assigned_at (timestamp)                    │
    │ completed_at (timestamp)                   │
    └────┬──────────────────────────────────────┘
         │
         │ 1 nomination
         │ 1 or 0 transfer
         │
    ┌────▼──────────────────────────────────────┐
    │ SALARY_TRANSFERS                          │
    ├────────────────────────────────────────────┤
    │ id (PK)                                    │
    │ faculty_id (FK → users)                    │
    │ amount_tokens (decimal)                    │
    │ status (INITIATED/HOD_APPROVED/           │
    │         FINANCE_APPROVED/COMPLETED)       │
    │ hod_approved_by (FK → users HOD)          │
    │ hod_approval_at (timestamp)                │
    │ finance_approved_by (FK → users FINANCE) │
    │ finance_approval_at (timestamp)            │
    │ tx_hash (blockchain reference)             │
    │ created_at (timestamp)                     │
    │ completed_at (timestamp)                   │
    └────┬──────────────────────────────────────┘
         │
         │ Transfer execution
         │ recorded on blockchain
         │
    ┌────▼──────────────────────────────────────┐
    │ TOKENS (Balance History)                  │
    ├────────────────────────────────────────────┤
    │ id (PK)                                    │
    │ user_id (FK)                               │
    │ balance (decimal)                          │
    │ source (MINT/STRUCTURED/UNSTRUCTURED)     │
    │ reference_id (task/transfer id)            │
    │ updated_at (timestamp)                     │
    └────────────────────────────────────────────┘

    ┌────────────────────────────────────────────┐
    │ AUDIT_LOG (Immutable)                     │
    ├────────────────────────────────────────────┤
    │ id (PK)                                    │
    │ action (CREATED/APPROVED/REJECTED)        │
    │ entity_type (user/task/transfer)          │
    │ entity_id (FK)                             │
    │ actor_id (FK → users)                      │
    │ changes (JSON of before→after)             │
    │ tx_hash (if blockchain involved)           │
    │ timestamp (immutable)                      │
    │ ip_address (for security)                  │
    └────────────────────────────────────────────┘
```

---

**This concludes the UML and architecture documentation.**

All diagrams show how data flows, roles interact, and the system maintains immutable audit trails through every action.

Use these as reference when building components to understand the broader context of what your code connects to.

---

**Last Updated**: July 8, 2026
**Version**: 1.0 - Complete System Architecture
**Approved For**: All development team reference
