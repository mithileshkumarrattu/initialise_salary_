import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  // Fetch user profile with role
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role, organization_id")
    .eq("id", user.id)
    .single();

  // If no profile (table may not exist yet), use auth data
  const userProfile = profile ?? {
    id: user.id,
    name: user.user_metadata?.full_name ?? user.email,
    email: user.email ?? "",
    role: "admin",
    organization_id: null,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar role={userProfile.role} userName={userProfile.name} userEmail={userProfile.email} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
