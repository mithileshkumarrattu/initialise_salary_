'use client';

/**
 * Dashboard Page - Role-Based View
 * 
 * This page serves as the main dashboard for all authenticated users.
 * Based on the user's role, it displays different content:
 * - DIRECTOR: Organization overview, all departments, token minting
 * - HOD: Department overview, faculty management, approvals
 * - FACULTY: Personal progress, assigned tasks, schedule
 * - FINANCE: Token balances, approvals, payroll
 * - EMPLOYEE: Similar to FACULTY (for enterprise orgs)
 * - MANAGER: Similar to HOD (for enterprise orgs)
 * 
 * Data fetching pattern:
 * 1. Component mounts → useEffect triggered
 * 2. Fetch user role from DB
 * 3. Render appropriate dashboard based on role
 * 4. Handle loading/error states
 */

import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <DashboardShell />
      </div>
    </main>
  );
}
