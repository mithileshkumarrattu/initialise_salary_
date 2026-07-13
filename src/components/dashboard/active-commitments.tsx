"use client";

import { useState } from "react";
import { Target, Calendar, Award, Send, Loader2, X, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface UnstructuredTask {
  id: string;
  title: string;
  description: string;
  token_points: number;
  deadline: string;
  priority: string;
  status: string;
}

interface ActiveCommitmentsProps {
  tasks: UnstructuredTask[];
  userId: string;
  onRefresh: () => void;
}

export function ActiveCommitments({ tasks, userId, onRefresh }: ActiveCommitmentsProps) {
  const [selectedTask, setSelectedTask] = useState<UnstructuredTask | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofDesc, setProofDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!proofUrl) {
      setErrorMsg("Please specify a proof file URL or attachment.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const supabase = createClient();
      
      // 1. Insert into task_proofs
      const { error: proofError } = await supabase.from("task_proofs").insert({
        task_id: selectedTask.id,
        user_id: userId,
        file_url: proofUrl,
        description: proofDesc,
        verified: false,
      });

      if (proofError) throw proofError;

      // 2. Update unstructured task status to COMPLETED
      const { error: taskError } = await supabase
        .from("unstructured_tasks")
        .update({ status: "COMPLETED" })
        .eq("id", selectedTask.id);

      if (taskError) throw taskError;

      setSelectedTask(null);
      setProofUrl("");
      setProofDesc("");
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit task proof.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
          <Target size={16} className="text-primary" />
          <span>Active Commitments</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          {tasks.length} Active
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
          <Target size={28} className="text-muted-foreground/50 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-muted-foreground">No active commitments</p>
            <p className="text-[10px] text-muted-foreground/70 max-w-xs mt-1">
              You are not currently assigned to any ad-hoc tasks. Search the Task Pool to find open issues.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-border bg-background p-4 space-y-3 hover:border-primary/50 transition"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-foreground leading-relaxed">{task.title}</h4>
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase shrink-0 ${
                    task.priority === "URGENT" ? "bg-destructive/10 text-destructive" :
                    task.priority === "HIGH" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-bold text-primary">
                  <Award size={12} /> {Number(task.token_points).toFixed(0)} WORK
                </span>
                <span className="flex items-center gap-1 font-mono text-[9px]">
                  <Calendar size={10} /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Limit"}
                </span>
              </div>

              <button
                onClick={() => setSelectedTask(task)}
                className="w-full flex items-center justify-center gap-1 rounded bg-muted hover:bg-muted/80 border border-border/80 py-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground transition"
              >
                Submit Proof of Payout
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Proof Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form
            onSubmit={handleSubmitProof}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            <div className="flex gap-3">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
                <Send size={20} />
              </span>
              <div>
                <h4 className="text-base font-bold text-foreground">Submit Task Proof</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload completed assets or logs for **{selectedTask.title}**
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proof File URL / Reference</label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="e.g. https://github.com/org/repo/pull/12"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivery Notes</label>
                <textarea
                  value={proofDesc}
                  onChange={(e) => setProofDesc(e.target.value)}
                  placeholder="Add notes describing details of the work performed..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive font-mono bg-destructive/5 border border-destructive/10 rounded-lg p-2.5">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="flex-1 rounded-lg bg-secondary border border-border hover:bg-secondary/80 py-2.5 text-xs font-bold text-secondary-foreground transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary hover:bg-primary/90 py-2.5 text-xs font-bold text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-50 transition"
              >
                {submitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Submit Deliverables
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
