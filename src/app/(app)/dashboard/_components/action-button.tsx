"use client";

import { useState } from "react";
import { Coins, HandCoins, AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ActionButtonProps {
  eligible: boolean;
  loanBalance: number;
  userId: string;
  userOrgId: string;
  onRefresh: () => void;
}

export function ActionButton({ eligible, loanBalance, userId, userOrgId, onRefresh }: ActionButtonProps) {
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form state
  const [loanAmount, setLoanAmount] = useState("");
  const [loanReason, setLoanReason] = useState("");

  const handleSalaryRelease = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const supabase = createClient();
      
      // Create a Salary Transfer transaction record
      const { error } = await supabase.from("token_transactions").insert({
        organization_id: userOrgId,
        to_user_id: userId,
        amount: 2500, // Monthly salary amount
        type: "SALARY_TRANSFER",
        status: "CONFIRMED", // Directly confirmed for simulation
        notes: "Monthly cyclical salary token release.",
      });

      if (error) throw error;
      
      // Update progress_percentage back to 0 after payout
      await supabase.from("users").update({
        progress_percentage: 0
      }).eq("id", userId);

      setShowSalaryModal(false);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process salary release.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(loanAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg("Please enter a valid loan amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const supabase = createClient();

      // Submit Loan request
      const { error } = await supabase.from("loans").insert({
        organization_id: userOrgId,
        user_id: userId,
        amount: amountNum,
        remaining: amountNum,
        reason: loanReason,
        status: "PENDING",
      });

      if (error) throw error;

      setShowLoanModal(false);
      setLoanAmount("");
      setLoanReason("");
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit loan request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center space-y-4 shadow-lg backdrop-blur-sm">
      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Payroll Control Center</h3>
        <p className="text-xs text-muted-foreground">Initiate rewards and loan operations</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {eligible ? (
          <button
            onClick={() => setShowSalaryModal(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
          >
            <Coins size={16} /> Initiate Salary Release
          </button>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-center text-warning text-[10px] font-medium leading-relaxed">
              Salary release is locked until your monthly attendance score reaches the 85% threshold.
            </div>
            <button
              onClick={() => setShowLoanModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted py-3 text-sm font-bold text-foreground transition"
            >
              <HandCoins size={16} /> Raise Work Loan Request
            </button>
          </div>
        )}
      </div>

      {/* Salary Confirmation Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowSalaryModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="flex gap-3">
              <span className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                <Coins size={24} />
              </span>
              <div>
                <h4 className="text-base font-bold text-foreground">Confirm Salary Release</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You are eligible to release your monthly base reward of **2,500 WORK** tokens.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Credited To</span>
                <span className="font-mono text-foreground">{userId.substring(0, 18)}...</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Release Token Payout</span>
                <span className="font-bold text-primary">2,500.00 WORK</span>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-destructive font-mono">{errorMsg}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSalaryModal(false)}
                className="flex-1 rounded-lg bg-secondary border border-border hover:bg-secondary/80 py-2.5 text-xs font-bold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSalaryRelease}
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary hover:bg-primary/90 py-2.5 text-xs font-bold text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={12} className="animate-spin" /> : "Confirm Release"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleLoanSubmit} className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowLoanModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="flex gap-3">
              <span className="rounded-lg bg-warning/10 p-2 text-warning shrink-0">
                <HandCoins size={24} />
              </span>
              <div>
                <h4 className="text-base font-bold text-foreground">Raise Work Loan</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Request an advance on token earnings. Loan balances are repaid automatically from future ad-hoc task payouts.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Request Amount (WORK)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Reason / Justification</label>
                <textarea
                  value={loanReason}
                  onChange={(e) => setLoanReason(e.target.value)}
                  placeholder="Explain why you need the token advance..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            {errorMsg && <p className="text-xs text-destructive font-mono">{errorMsg}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLoanModal(false)}
                className="flex-1 rounded-lg bg-secondary border border-border hover:bg-secondary/80 py-2.5 text-xs font-bold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary hover:bg-primary/90 py-2.5 text-xs font-bold text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={12} className="animate-spin" /> : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
