import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignedTasks } from '@/lib/db/queries/tasks';
import MyWorkClient from '@/components/my-work/MyWorkClient';
import { AlertCircle } from 'lucide-react';

export default async function MyWorkPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  let tasks = [];
  try {
    tasks = await getAssignedTasks(user.id);
  } catch (err) {
    console.error("Failed to load tasks:", err);
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Failed to load tasks</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">There was a problem communicating with the database. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Work</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your assigned tasks and priorities.</p>
        </div>
      </div>

      <MyWorkClient tasks={tasks} />
    </div>
  );
}
