"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import DirectorDashboard from "./_components/director-dashboard";
import HodDashboard from "./_components/hod-dashboard";
import FacultyDashboard from "./_components/faculty-dashboard";
import FinanceDashboard from "./_components/finance-dashboard";
import EmployeeDashboard from "./_components/employee-dashboard";
import ManagerDashboard from "./_components/manager-dashboard";
import HrDashboard from "./_components/hr-dashboard";

type RoleType = "FACULTY" | "HOD" | "DIRECTOR" | "FINANCE" | "EMPLOYEE" | "MANAGER" | "HR_ADMIN";

export default function DashboardPage() {
  const [role, setRole] = useState<RoleType>("FACULTY");
  const [userData, setUserData] = useState<any>(null);
  const [structuredTasks, setStructuredTasks] = useState<any[]>([]);
  const [unstructuredTasks, setUnstructuredTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const TEST_USER_ID = "018eec7a-3bb2-7f8a-9231-44c521ab5222"; // Devon Turing (Employee/Faculty)

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const todayStr = new Date().toISOString().split("T")[0];

      // 1. Fetch user record
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, organization_id, name, progress_percentage, token_balance, loan_balance")
        .eq("id", TEST_USER_ID)
        .single();

      if (userError) throw userError;

      // 2. Auto-seed structured tasks for today if none exist, so the timetable is populated
      const { data: existingTasks, error: checkError } = await supabase
        .from("structured_tasks")
        .select("id")
        .eq("user_id", TEST_USER_ID)
        .eq("date", todayStr);

      if (!checkError && (!existingTasks || existingTasks.length === 0)) {
        await supabase.from("structured_tasks").insert([
          {
            organization_id: user.organization_id,
            user_id: TEST_USER_ID,
            task_type: "LECTURE",
            subject: "Quantum Mechanics & Wave Theory",
            date: todayStr,
            time_slot: "09:00 AM - 10:30 AM",
            location: "Lecture Hall Block A",
            status: "UPCOMING",
          },
          {
            organization_id: user.organization_id,
            user_id: TEST_USER_ID,
            task_type: "LAB",
            subject: "Advanced Computing Lab",
            date: todayStr,
            time_slot: "11:00 AM - 12:30 PM",
            location: "Computer Lab 4",
            status: "UPCOMING",
          }
        ]);
      }

      // 3. Fetch structured tasks
      const { data: sTasks, error: sTasksError } = await supabase
        .from("structured_tasks")
        .select("*")
        .eq("user_id", TEST_USER_ID)
        .eq("date", todayStr)
        .order("time_slot", { ascending: true });

      if (sTasksError) throw sTasksError;

      // 4. Fetch assigned unstructured tasks
      const { data: uTasks, error: uTasksError } = await supabase
        .from("unstructured_tasks")
        .select("*")
        .eq("assigned_to_id", TEST_USER_ID)
        .in("status", ["ASSIGNED", "IN_PROGRESS"])
        .order("priority", { ascending: false });

      if (uTasksError) throw uTasksError;

      setUserData({
        id: user.id,
        orgId: user.organization_id,
        name: user.name,
        progress: Number(user.progress_percentage) || 0,
        tokenBalance: Number(user.token_balance) || 0,
        loanBalance: Number(user.loan_balance) || 0,
      });
      setStructuredTasks(sTasks || []);
      setUnstructuredTasks(uTasks || []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch database data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "FACULTY") {
      fetchData();
    }
  }, [role, fetchData]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time contribution stats, token circulation, and audit summary
          </p>
        </div>

        {/* Dynamic simulator in page for preview */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 self-start">
          <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" /> Simulate Role:
          </span>
          {[
            { id: "FACULTY", name: "Faculty" },
            { id: "HOD", name: "HOD" },
            { id: "DIRECTOR", name: "Director" },
            { id: "FINANCE", name: "Finance" },
            { id: "EMPLOYEE", name: "Employee (IC)" },
            { id: "MANAGER", name: "Manager" },
            { id: "HR_ADMIN", name: "HR / Admin" },
          ].map((roleObj) => (
            <button
              key={roleObj.id}
              onClick={() => setRole(roleObj.id as RoleType)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition ${role === roleObj.id
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                }`}
            >
              {roleObj.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Dashboard View Rendering */}
      <div className="space-y-6">
        {role === "FACULTY" && (
          loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 font-mono text-xs gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-400" />
              <span>Loading Faculty Dashboard from Supabase...</span>
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-xs text-rose-400 font-mono">
              {errorMsg}
            </div>
          ) : (
            <FacultyDashboard
              userData={userData}
              structuredTasks={structuredTasks}
              unstructuredTasks={unstructuredTasks}
              onRefresh={fetchData}
            />
          )
        )}
        {role === "HOD" && <HodDashboard />}
        {role === "DIRECTOR" && <DirectorDashboard />}
        {role === "FINANCE" && <FinanceDashboard />}
        {role === "EMPLOYEE" && <EmployeeDashboard />}
        {role === "MANAGER" && <ManagerDashboard />}
        {role === "HR_ADMIN" && <HrDashboard />}
      </div>

      {/* Shared Monthly Progress Graph */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left progress card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-900 bg-slate-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Monthly Progress Graph</h3>
            <span className="text-xs text-slate-500">Updated hourly</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-2 border-b border-slate-800 pb-2">
            {[45, 55, 60, 48, 70, 85, 88].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-emerald-400 transition-opacity">
                  {val}%
                </span>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${val >= 85 ? "bg-emerald-500 shadow-lg shadow-emerald-500/10" : "bg-slate-700 hover:bg-slate-650"
                    }`}
                  style={{ height: `${val * 2}px` }}
                ></div>
                <span className="text-[10px] text-slate-500 font-semibold">Wk {idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span>Target Met (Progress &ge; 85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-700"></span>
              <span>Accumulating Progress</span>
            </div>
          </div>
        </div>

        {/* Right side activity feed */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              { type: "MINT", desc: "Minted ad-hoc reward", wallet: "0x3f5c...9a21", amount: "+50 WT", time: "2 hrs ago" },
              { type: "SALARY", desc: "Salary transfer request", wallet: "0x8e21...12cf", amount: "340 WT", time: "1 day ago" },
              { type: "REPAY", desc: "Loan repayment deduction", wallet: "0x3f5c...9a21", amount: "-10 WT", time: "3 days ago" },
              { type: "LOAN", desc: "Work Loan issued", wallet: "0x8e21...12cf", amount: "+120 WT", time: "4 days ago" }
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-900 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${tx.type === "MINT" ? "bg-emerald-500/10 text-emerald-400" :
                      tx.type === "SALARY" ? "bg-blue-500/10 text-blue-400" :
                        tx.type === "REPAY" ? "bg-rose-500/10 text-rose-400" :
                          "bg-purple-500/10 text-purple-400"
                      }`}>
                      {tx.type}
                    </span>
                    <span className="font-semibold text-slate-200">{tx.desc}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-mono">{tx.wallet}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${tx.amount.startsWith("+") ? "text-emerald-400" : "text-slate-300"}`}>
                    {tx.amount}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
