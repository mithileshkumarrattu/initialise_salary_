"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database, ShieldCheck, AlertCircle, RefreshCw, Table2, CheckCircle2 } from "lucide-react";

export default function DbTestPage() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [tablesList, setTablesList] = useState<string[]>([]);
  const [queryTable, setQueryTable] = useState("users");
  const [queryResult, setQueryResult] = useState<any>(null);

  // Expected tables to check
  const candidateTables = [
    "organizations", 
    "departments", 
    "users", 
    "wallet_keys", 
    "role_permissions", 
    "structured_tasks", 
    "unstructured_tasks", 
    "nominations", 
    "task_proofs", 
    "token_transactions", 
    "loans", 
    "attendance_batches", 
    "rate_cards", 
    "semester_calendars", 
    "integrations", 
    "activity_events", 
    "meeting_action_items", 
    "capacity_snapshots", 
    "audit_logs", 
    "notifications"
  ];

  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus("IDLE");
    setErrorMessage("");
    setQueryResult(null);

    try {
      const res = await fetch("/api/db-diagnostics");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API returned ${res.status}: ${text}`);
      }
      const result = await res.json();
      if (result.success) {
        setTablesList(result.tables);
        setConnectionStatus(result.tables.length > 0 ? "SUCCESS" : "FAILED");
        if (result.tables.length === 0) {
          setErrorMessage("Connected to database, but no tables exist in the public schema yet.");
        }
      } else {
        throw new Error(result.error || "Failed database scan");
      }
    } catch (err: any) {
      setConnectionStatus("FAILED");
      setErrorMessage(err.message || "Failed to scan database schemas.");
    } finally {
      setLoading(false);
    }
  };

  const handleQueryTable = async (e: any) => {
    e.preventDefault();
    if (!queryTable) return;
    setLoading(true);
    setQueryResult(null);
    setErrorMessage("");

    try {
      const res = await fetch("/api/db-diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: queryTable })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setQueryResult(result.data);
      } else {
        setErrorMessage(result.error || "Query failed");
      }
    } catch (err: any) {
      setErrorMessage(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-start font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-500 p-2.5 text-slate-950">
              <Database size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Database Diagnostic Panel</h1>
              <p className="text-xs text-slate-500 mt-0.5">Verify Supabase schemas and test client query flows</p>
            </div>
          </div>
          <button
            onClick={testConnection}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-emerald-400 transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Run Scan
          </button>
        </div>

        {/* Connection Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 rounded-xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between h-40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Connection status</span>
            <div>
              {connectionStatus === "SUCCESS" && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold text-lg">
                  <CheckCircle2 size={20} /> SCAN ACTIVE
                </span>
              )}
              {connectionStatus === "FAILED" && (
                <span className="text-rose-400 flex items-center gap-1.5 font-bold text-lg">
                  <AlertCircle size={20} /> SCAN ERROR
                </span>
              )}
              {connectionStatus === "IDLE" && (
                <span className="text-slate-400 flex items-center gap-1.5 font-bold text-lg">
                  <RefreshCw className="animate-spin" size={20} /> SCANNING...
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Empty"}
            </p>
          </div>

          {/* Tables Found List */}
          <div className="md:col-span-2 rounded-xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between min-h-40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tables Discovered in Database ({tablesList.length})</span>
            {tablesList.length > 0 ? (
              <div className="flex flex-wrap gap-2 py-2">
                {tablesList.map((table, i) => (
                  <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs font-mono">
                    {table}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">
                No verified tables discovered. Scanning target schemas...
              </p>
            )}
            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 flex justify-between">
              <span>Checking 20 target tables</span>
              <span>Supabase REST Endpoint v1</span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex gap-3 items-start text-xs text-rose-400 leading-normal">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Diagnostic Warning</p>
              <p className="mt-0.5 font-mono">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Table Inspector Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Query Form */}
          <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Table2 size={16} /> Table Inspector
            </h3>
            
            <form onSubmit={handleQueryTable} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Table Name</label>
                <input
                  type="text"
                  value={queryTable}
                  onChange={(e) => setQueryTable(e.target.value)}
                  placeholder="e.g. User"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 py-2 text-xs font-bold text-slate-300 hover:bg-slate-850 hover:text-white transition disabled:opacity-50"
              >
                Inspect Table Content
              </button>
            </form>
          </div>

          {/* Results Output */}
          <div className="md:col-span-2 rounded-xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inspect Results</h3>
            <div className="rounded-lg border border-slate-950 bg-slate-950 p-4 min-h-36 overflow-auto max-h-96">
              {queryResult ? (
                <pre className="text-xs font-mono text-emerald-400 leading-normal">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-slate-600 text-center py-12 font-mono">
                  No query outputs inspected. Select a table and execute query.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
