"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, ListTodo, CheckSquare, Users,
  Wallet, Settings, LogOut, Bell, Shield, BookOpen
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Role-based nav items per spec
const NAV_BY_ROLE: Record<string, { href: string; label: string; icon: any }[]> = {
  director: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/team", label: "Team", icon: Users },
    { href: "/finance", label: "Finance", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/audit", label: "Audit Log", icon: Shield },
  ],
  hod: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/approvals", label: "Approvals", icon: CheckSquare },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  faculty: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  finance: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/finance", label: "Finance", icon: Wallet },
    { href: "/approvals", label: "Approvals", icon: CheckSquare },
    { href: "/audit", label: "Audit Log", icon: Shield },
  ],
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/approvals", label: "Approvals", icon: CheckSquare },
    { href: "/team", label: "Team", icon: Users },
    { href: "/finance", label: "Finance", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/audit", label: "Audit Log", icon: Shield },
  ],
  manager: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  employee: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  dean: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-work", label: "My Work", icon: Briefcase },
    { href: "/task-pool", label: "Task Pool", icon: ListTodo },
    { href: "/approvals", label: "Approvals", icon: CheckSquare },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
};

interface AppSidebarProps {
  role: string;
  userName: string;
  userEmail: string;
}

export default function AppSidebar({ role, userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.employee;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    ? userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");

  return (
    <aside className="w-64 h-screen flex flex-col bg-card border-r border-border flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">WT</span>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">WorkToken</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Profile section */}
      <div className="p-3 border-t border-border space-y-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition w-full"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{userName}</div>
            <div className="text-xs text-muted-foreground truncate">{roleLabel}</div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-error hover:bg-error/10 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
