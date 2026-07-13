import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserFinanceData } from '@/lib/db/queries/finance';
import FinanceClient from '@/components/finance/FinanceClient';
import { AlertCircle } from 'lucide-react';

export default async function FinancePage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  let financeData;
  try {
    financeData = await getUserFinanceData(user.id);
  } catch (err) {
    console.error("Failed to load finance data:", err);
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Failed to load finance data</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">There was a problem communicating with the database. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your tokens, wallets, and transactions.</p>
      </div>

      <FinanceClient data={financeData} />
    </div>
  );
}
