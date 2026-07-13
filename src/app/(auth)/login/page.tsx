"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto p-6 bg-card border border-border rounded-xl shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Enter credentials to access your workspace
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-error/10 border border-error/20 text-error rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
        >
          {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground pt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create organization
        </Link>
      </p>
    </div>
  );
}
