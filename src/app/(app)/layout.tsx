"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  ListTodo,
  Users2,
  BadgeDollarSign,
  Plug,
  Settings,
  ShieldCheck,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [orgType, setOrgType] = useState<"COLLEGE" | "ENTERPRISE">("COLLEGE");
  const [userRole, setUserRole] = useState<string>("FACULTY");

  // Adjust role options based on Org Type
  useEffect(() => {
    if (orgType === "COLLEGE") {
      setUserRole("FACULTY");
    } else {
      setUserRole("EMPLOYEE");
    }
  }, [orgType]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
    { name: "My Work", href: "/my-work", icon: CalendarDays, roles: ["ALL"] },
    { name: "Task Pool", href: "/task-pool", icon: ListTodo, roles: ["ALL"] },
    { name: "Team Overview", href: "/team", icon: Users2, roles: ["HOD", "DIRECTOR", "MANAGER", "HR_ADMIN"] },
    { name: "Financials", href: "/finance", icon: BadgeDollarSign, roles: ["FINANCE", "DIRECTOR", "HR_ADMIN", "MANAGER"] },
    { name: "Integrations", href: "/integrations", icon: Plug, roles: ["ADMIN", "HR_ADMIN", "EMPLOYEE", "MANAGER"], orgType: "ENTERPRISE" },
    { name: "Audit Trail", href: "/audit", icon: ShieldCheck, roles: ["ADMIN", "FINANCE", "DIRECTOR", "HR_ADMIN"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["ALL"] },
  ];

  // Helper to determine if menu item applies to current role/org
  const isItemVisible = (item: typeof navItems[0]) => {
    if (item.orgType && item.orgType !== orgType) return false;
    if (item.roles.includes("ALL")) return true;
    return item.roles.includes(userRole);
  };

  const filteredNavItems = navItems.filter(isItemVisible);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground md:hidden shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background/80 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="rounded-lg bg-primary p-1.5 text-primary-foreground font-bold">WT</span>
            <span className="text-lg font-bold tracking-wider text-foreground">
              WorkToken
            </span>
          </Link>
        </div>

        {/* Demo Switcher Panel */}
        <div className="m-4 rounded-xl border border-border bg-muted/50 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-primary" /> Environment Simulator
            </span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex rounded-md bg-muted p-0.5 border border-border">
              <button
                onClick={() => setOrgType("COLLEGE")}
                className={`flex-1 rounded-sm py-1 text-[10px] font-bold uppercase transition ${
                  orgType === "COLLEGE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                College
              </button>
              <button
                onClick={() => setOrgType("ENTERPRISE")}
                className={`flex-1 rounded-sm py-1 text-[10px] font-bold uppercase transition ${
                  orgType === "ENTERPRISE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Enterprise
              </button>
            </div>

            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
            >
              {orgType === "COLLEGE" ? (
                <>
                  <option value="FACULTY">Faculty (Employee)</option>
                  <option value="HOD">HOD (Manager)</option>
                  <option value="DIRECTOR">Director (Executive)</option>
                  <option value="FINANCE">Finance Dept</option>
                  <option value="ADMIN">System Admin</option>
                </>
              ) : (
                <>
                  <option value="EMPLOYEE">Employee (IC)</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HR_ADMIN">HR / Admin</option>
                  <option value="FINANCE">Finance</option>
                  <option value="ADMIN">System Admin</option>
                </>
              )}
            </select>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-4 overflow-y-auto h-[calc(100vh-170px)]">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border px-8 bg-background/50 backdrop-blur-md">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {orgType === "COLLEGE" ? "MVGR College of Engineering" : "Acme Corporation"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</h4>
                    <Link href="/notifications" className="text-[10px] text-primary hover:underline">View All</Link>
                  </div>
                  <div className="divide-y divide-border text-xs">
                    <div className="py-2.5 space-y-1">
                      <p className="font-semibold text-foreground">Attendance Approved</p>
                      <p className="text-muted-foreground text-[10px]">HOD approved your structured task attendance for OOP Class.</p>
                      <p className="text-muted-foreground text-[9px]">10 minutes ago</p>
                    </div>
                    <div className="py-2.5 space-y-1">
                      <p className="font-semibold text-foreground">New Task Available</p>
                      <p className="text-muted-foreground text-[10px]">Ad-hoc Task "NBA Accreditation File Preparation" was published.</p>
                      <p className="text-muted-foreground text-[9px]">2 hours ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-foreground">Dr. R. K. Prasad</span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{userRole}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-sm shadow-sm">
                RP
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
