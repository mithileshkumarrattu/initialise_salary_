"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface StructuredTask {
  id: string;
  user_id: string;
  subject: string;
  time_slot: string;
  attendance_present: number;
  attendance_absent: number;
}

interface AttendanceModalProps {
  task: StructuredTask;
  onClose: () => void;
}

export function AttendanceModal({ task, onClose }: AttendanceModalProps) {
  const [present, setPresent] = useState(task.attendance_present || 0);
  const [absent, setAbsent] = useState(task.attendance_absent || 0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (present < 0 || absent < 0) {
      setErrorMsg("Counts cannot be negative.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const supabase = createClient();
      
      // Update structured task attendance
      const { error: taskError } = await supabase
        .from("structured_tasks")
        .update({
          attendance_present: present,
          attendance_absent: absent,
          status: "PENDING_APPROVAL"
        })
        .eq("id", task.id);

      if (taskError) throw taskError;

      // Increment progress percentage in user record (simulating completed work credits)
      const { data: user, error: userFetchError } = await supabase
        .from("users")
        .select("progress_percentage")
        .eq("id", task.user_id)
        .single();
      
      if (!userFetchError && user) {
        const nextProgress = Math.min(100, (Number(user.progress_percentage) || 0) + 15);
        await supabase
          .from("users")
          .update({ progress_percentage: nextProgress })
          .eq("id", task.user_id);
      }

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-900 bg-slate-950 p-6 space-y-6 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-200"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex gap-3">
          <span className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 shrink-0">
            <Users size={20} />
          </span>
          <div>
            <h4 className="text-base font-bold text-white">Log Class Attendance</h4>
            <p className="text-xs text-slate-400 mt-1">
              Verify student headcount for **{task.subject}** ({task.time_slot})
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Present</label>
            <input
              type="number"
              min="0"
              value={present}
              onChange={(e) => setPresent(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Absent</label>
            <input
              type="number"
              min="0"
              value={absent}
              onChange={(e) => setAbsent(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none"
              required
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 font-mono bg-rose-500/5 border border-rose-500/10 rounded-lg p-2.5">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 py-2.5 text-xs font-bold text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5 disabled:opacity-50 transition"
          >
            {submitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <CheckCircle size={14} /> Submit Logs
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
