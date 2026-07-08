# 🚀 WorkToken Implementation Start Here

## ⚡ Quick Start (5 minutes)

### What's been done:
✅ Project structure cleaned (removed `\(app\)` backslash folder)
✅ One UI design system implemented
✅ Custom One UI Sans font loaded
✅ All design tokens in globals.css
✅ 10 pages fully specified
✅ Complete documentation created

### What's left:
- Build the 10 pages with components
- Implement backend query layer
- Connect to database
- Deploy to Vercel

---

## 📚 Documentation Files (Read in This Order)

### 1. **For Designers & Product Managers**
- `ONEUI_DESIGN_TOKENS.md` - Complete color, typography, spacing reference
- Design images: See colors section

### 2. **For Developers (Architecture)**
- `MASTER_PROMPT_UPDATED.md` - Complete project spec + One UI system
- `PAGE_STRUCTURE_COMPLETE.md` - All 10 pages detailed

### 3. **For Frontend Developers (Building Pages)**
- `PAGE_BUILDING_TEMPLATE.md` - Copy this for each team member
- Fill in: Route name, then assign to developer

### 4. **For Debugging / Context Issues**
- `AGENT_REHABILITATION_PROMPT.md` - Fixes hallucination
- `AGENT_QUICK_REFERENCE.md` - Quick lookup card

### 5. **For System Design**
- `SYSTEM_DIAGRAMS.md` - 7 UML diagrams (class, state, sequence, etc.)

---

## 🎨 Design System Reference (One UI)

### Primary Color
```
Hex: #8F7AFF (Purple)
RGB: 143, 122, 255
HSL: 262° 100% 55%
Usage: Buttons, headers, links, focus states
```

### Secondary Color
```
Hex: #8644D7 (Darker Purple)
RGB: 134, 68, 215
HSL: 270° 68% 50%
Usage: Hover states, secondary actions
```

### Accent Colors
- **Cyan**: #00D4FF (Galaxy AI features)
- **Yellow**: #FFD700 (Warnings, pending)
- **Success**: #24C856 (Confirmations)
- **Error**: #FF3B30 (Destructive)

### Neutrals
- **Light Background**: #FFFFFF (white)
- **Light Text**: #1A1B2E (near black)
- **Light Border**: #E8E9F0 (light gray)
- **Dark Background**: #1F202E
- **Dark Text**: #FAFAFA (near white)
- **Dark Border**: #3A3C52

### Typography
- **Font**: One UI Sans (loaded from `/public/fonts/`)
- **Fallback**: Inter → system-ui
- **Title**: 36px, 700 Bold
- **Heading**: 24px, 600 Semibold
- **Body**: 14px, 400 Regular

### Spacing
- Use Tailwind: p-2 (8px), p-4 (16px), p-6 (24px)
- Gap for flexbox: gap-2, gap-4, gap-6
- Mobile padding: 16px, Desktop: 24px

### Border Radius
- Buttons/Inputs: 12px (rounded-lg)
- Cards: 12px (rounded-lg)
- Dialogs: 24px (rounded-2xl)

---

## 📂 Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── my-work/
│   │   ├── task-pool/
│   │   ├── approvals/
│   │   ├── team/
│   │   ├── finance/
│   │   ├── settings/
│   │   └── profile/
│   ├── api/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── approvals/
│   │   └── finance/
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   └── globals.css
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── tasks/
│   ├── common/
│   │   ├── RoleGate.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ErrorState.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── db/
│   │   ├── queries/ (all query functions)
│   │   └── schema.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   ├── approvals.ts
│   │   ├── finance.ts
│   │   └── index.ts
│   ├── auth/ (session management)
│   └── utils/ (helpers)
└── public/
    ├── fonts/
    │   └── Variable_One_UI_Sans.ttf
    └── images/
```

---

## 🛠️ Development Workflow

### Step 1: Read Project Spec
Give new developer the content of `MASTER_PROMPT_UPDATED.md`

### Step 2: Assign a Page
Use template from `PAGE_BUILDING_TEMPLATE.md`, fill in route, give to developer

Example:
```
Route: /dashboard
Components Needed: 
- DashboardHeader
- MetricsCards
- ActivityFeed
Backend Queries:
- getUserProfile()
- getUserMetrics()
```

### Step 3: Developer Builds Page
- Create components in `/src/components/`
- Import queries from `/lib/db/queries/`
- Use RoleGate for access control
- Apply One UI design tokens
- Implement three-state pattern

### Step 4: Review & Merge
- Check all colors use CSS variables
- Verify responsive on mobile/desktop
- Test error states
- Check accessibility
- Merge to main branch

---

## 🎯 Golden Rules

1. **NEVER hardcode colors**
   ```css
   /* ❌ WRONG */
   background-color: #8F7AFF;
   
   /* ✅ RIGHT */
   background-color: hsl(var(--primary));
   ```

2. **NEVER check role in JSX**
   ```jsx
   /* ❌ WRONG */
   {userRole === 'admin' && <Panel />}
   
   /* ✅ RIGHT */
   <RoleGate requiredRole="admin"><Panel /></RoleGate>
   ```

3. **NEVER write queries in components**
   - All queries in `lib/db/queries/`
   - Import and call from components

4. **ALWAYS implement three-state**
   - Loading (spinner)
   - Error (error message)
   - Success (content)

5. **ALWAYS use TypeScript**
   - Types in `lib/types/`
   - No `any` type
   - Proper error typing

6. **ALWAYS log sensitive actions**
   - Every approval, withdrawal, role change
   - Logged to `audit_logs` table

---

## 🧪 Testing Checklist

For every page before merge:

- [ ] Loading state works (spinner appears)
- [ ] Error state shows error message + retry
- [ ] Success state displays all data correctly
- [ ] All colors from One UI system
- [ ] Mobile responsive (< 640px)
- [ ] Desktop view optimized (> 1024px)
- [ ] Tablet view smooth (640px - 1024px)
- [ ] No hardcoded colors in code
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Role-based access working (try as different user)
- [ ] Error boundary catches errors
- [ ] No console errors or warnings

---

## 📊 Current Status

| Component | Status | Owner |
|-----------|--------|-------|
| Design System | ✅ Complete | Architecture |
| One UI Tokens | ✅ In globals.css | Frontend |
| Font Setup | ✅ One UI Sans loaded | Frontend |
| Page Structure | ✅ Documented | Architecture |
| Auth Pages | 🚧 To build | TBD |
| Dashboard | 🚧 To build | TBD |
| My Work | 🚧 To build | TBD |
| Task Pool | 🚧 To build | TBD |
| Approvals | 🚧 To build | TBD |
| Team | 🚧 To build | TBD |
| Finance | 🚧 To build | TBD |
| Settings | 🚧 To build | TBD |
| Profile | 🚧 To build | TBD |

---

## 🆘 Need Help?

### Hallucinating Agent?
→ Give them `AGENT_REHABILITATION_PROMPT.md`

### New Team Member Starting?
→ Give them `MASTER_PROMPT_UPDATED.md` then `PAGE_BUILDING_TEMPLATE.md`

### Need Page Specification?
→ See `PAGE_STRUCTURE_COMPLETE.md`

### Need Design Reference?
→ See `ONEUI_DESIGN_TOKENS.md`

### Need System Architecture?
→ See `SYSTEM_DIAGRAMS.md`

---

## 🚀 Next Steps

1. **Immediately**:
   - Review `ONEUI_DESIGN_TOKENS.md`
   - Verify design system in browser
   - Create first component with One UI colors

2. **This Week**:
   - Build Auth pages (Login, Signup)
   - Build Dashboard
   - Build My Work

3. **Next Week**:
   - Build remaining pages
   - Connect to database
   - Implement API routes

4. **Deployment**:
   - Deploy to Vercel
   - Set up database backups
   - Configure monitoring

---

## 📞 Questions?

- **Design tokens**: See `ONEUI_DESIGN_TOKENS.md`
- **Page details**: See `PAGE_STRUCTURE_COMPLETE.md`
- **Architecture**: See `SYSTEM_DIAGRAMS.md`
- **Building pages**: See `PAGE_BUILDING_TEMPLATE.md`
- **Fixing hallucination**: See `AGENT_REHABILITATION_PROMPT.md`

**All documentation in this repository root folder** - bookmark these files!
