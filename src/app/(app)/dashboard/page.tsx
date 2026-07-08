import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";
import HodDashboard from "@/components/dashboard/HodDashboard";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";
import GenericDashboard from "@/components/dashboard/GenericDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, email, role, organization_id, department_id, progress_percentage, token_balance, loan_balance")
    .eq("id", user.id)
    .single();

  // If no profile yet (DB not set up), show generic dashboard
  if (profileError || !profile) {
    return (
      <div className="p-6 lg:p-8">
        <GenericDashboard userName={user.user_metadata?.full_name ?? user.email ?? "User"} role="admin" />
      </div>
    );
  }

  const role = profile.role;

  return (
    <div className="p-6 lg:p-8">
      {role === "faculty" && <FacultyDashboard profile={profile} />}
      {(role === "hod" || role === "dean") && <HodDashboard profile={profile} />}
      {(role === "director") && <DirectorDashboard profile={profile} />}
      {(role === "admin" || role === "manager" || role === "finance" || role === "employee" || role === "hr_admin") && (
        <GenericDashboard userName={profile.name} role={role} />
      )}
    </div>
  );
}
