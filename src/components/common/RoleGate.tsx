import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface RoleGateProps {
  children: ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

export default async function RoleGate({
  children,
  requiredRole,
  allowedRoles,
  fallback,
}: RoleGateProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user role from public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role;

  if (!userRole) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--error)]">
        <p className="text-lg font-semibold">Error: Role not found</p>
        <p className="text-sm">Please contact support.</p>
      </div>
    );
  }

  const isAuthorized = requiredRole
    ? userRole === requiredRole
    : allowedRoles
    ? allowedRoles.includes(userRole)
    : true; // If no specific role is required, just being authenticated is enough

  if (!isAuthorized) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-[var(--muted-foreground)]">
          You do not have the required permissions to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
