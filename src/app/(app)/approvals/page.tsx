import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPendingApprovals } from '@/lib/db/queries/approvals';
import ApprovalsClient from '@/components/approvals/ApprovalsClient';
import { AlertCircle } from 'lucide-react';
import RoleGate from '@/components/common/RoleGate';

export default async function ApprovalsPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role, department_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Profile Error</h2>
        <p className="text-muted-foreground mt-2">Could not verify permissions.</p>
      </div>
    );
  }

  let approvals = [];
  try {
    approvals = await getPendingApprovals(profile.role, profile.department_id);
  } catch (err) {
    console.error("Failed to load approvals:", err);
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Failed to load approvals</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">There was a problem communicating with the database.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage pending requests.</p>
      </div>

      {/* RoleGate explicitly blocks regular faculty from seeing this entirely, though the Sidebar already hides the link */}
      <RoleGate allowedRoles={['hod', 'director', 'admin', 'finance', 'manager', 'hr_admin']}>
        <ApprovalsClient approvals={approvals} />
      </RoleGate>
    </div>
  );
}
