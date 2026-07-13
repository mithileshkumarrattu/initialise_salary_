"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { AttendanceModal } from "./attendance-modal";

interface StructuredTask {
  id: string;
  user_id: string;
  task_type: string;
  subject: string;
  date: string;
  time_slot: string;
  location: string;
  attendance_present: number;
  attendance_absent: number;
  status: "UPCOMING" | "COMPLETED" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  credits_earned: number;
}

interface TodayScheduleProps {
  tasks: StructuredTask[];
  onRefresh: () => void;
}

export function TodaySchedule({ tasks, onRefresh }: TodayScheduleProps) {
  const [selectedTask, setSelectedTask] = useState<StructuredTask | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
          <Calendar size={16} className="text-primary" />
          <span>Today's Timetable Schedule</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "Class" : "Classes"}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <Clock size={32} className="text-muted-foreground/50 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-muted-foreground">No scheduled classes today</p>
            <p className="text-[10px] text-muted-foreground/70 max-w-xs mt-1">
              Your structured timetable is empty for this date. Check settings or contact your HOD.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group rounded-xl border border-border bg-background p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary uppercase">
                    {task.task_type}
                  </span>
                  <h4 className="text-sm font-extrabold text-foreground leading-relaxed">{task.subject}</h4>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-[11px] font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {task.time_slot}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {task.location || "Unspecified Room"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                {/* Status Badges */}
                {task.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[10px] font-bold text-secondary-foreground">
                    <CheckCircle2 size={12} /> Approved
                  </span>
                )}
                {task.status === "PENDING_APPROVAL" && (
                  <span className="inline-flex items-center gap-1 rounded bg-warning/10 px-2 py-1 text-[10px] font-bold text-warning">
                    <RefreshCw size={12} className="animate-spin" /> Pending Approval
                  </span>
                )}
                {task.status === "REJECTED" && (
                  <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive">
                    <AlertCircle size={12} /> Rejected
                  </span>
                )}
                {task.status === "COMPLETED" && (
                  <span className="inline-flex items-center gap-1 rounded bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                    <CheckCircle2 size={12} /> Logged
                  </span>
                )}

                {/* Log Button */}
                {task.status === "UPCOMING" && (
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="rounded bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs font-bold text-primary-foreground shadow transition"
                  >
                    Log Attendance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <AttendanceModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
