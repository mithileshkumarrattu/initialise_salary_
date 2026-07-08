"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const COLLEGE_ROLES = [
  { value: "admin", label: "Admin (Platform Admin)" },
  { value: "director", label: "Director / Principal" },
  { value: "dean", label: "Dean" },
  { value: "hod", label: "HOD (Head of Department)" },
  { value: "faculty", label: "Faculty" },
  { value: "finance", label: "Finance Officer" },
];

const ENTERPRISE_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "finance", label: "Finance" },
  { value: "hr_admin", label: "HR Admin" },
];

const ORG_TYPES = [
  { value: "COLLEGE", label: "🎓 College / University" },
  { value: "ENTERPRISE", label: "🏢 Enterprise / Company" },
  { value: "GOVERNMENT", label: "🏛️ Government Organization" },
  { value: "NGO", label: "🌱 NGO / Non-Profit" },
];

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("COLLEGE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const roleOptions = orgType === "COLLEGE" ? COLLEGE_ROLES : ENTERPRISE_ROLES;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, orgName, orgType, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Sign in after registration
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        setErrorMsg("Account created! Please check your email to confirm, then log in.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
        <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
      </div>

      {step === 1 && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Set up your organization</h1>
            <p className="text-sm text-muted-foreground">Tell us about your organization first.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">{errorMsg}</div>
          )}

          <form className="space-y-4" onSubmit={handleStep1}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="orgName">Organization Name</label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. MVGR College of Engineering"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="orgType">Organization Type</label>
              <select
                id="orgType"
                value={orgType}
                onChange={(e) => { setOrgType(e.target.value); setRole("admin"); }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
              >
                {ORG_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Continue →
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Create your admin account</h1>
            <p className="text-sm text-muted-foreground">
              You are setting up <span className="font-semibold text-foreground">{orgName}</span>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">{errorMsg}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organization.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="role">I am a…</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />}
                {loading ? "Creating..." : "Create Workspace"}
              </button>
            </div>
          </form>
        </>
      )}

      <p className="text-center text-xs text-muted-foreground border-t border-border pt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
