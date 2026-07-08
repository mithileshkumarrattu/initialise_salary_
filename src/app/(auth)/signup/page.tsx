"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [orgType, setOrgType] = useState("COLLEGE");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Get Started</h1>
        <p className="text-sm text-slate-400">
          Create a new workspace for your organization
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300" htmlFor="orgName">
            Organization Name
          </label>
          <input
            id="orgName"
            type="text"
            placeholder="e.g. MVGR College or Acme Corp"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300" htmlFor="orgType">
            Organization Type
          </label>
          <select
            id="orgType"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition"
          >
            <option value="COLLEGE">🎓 College Setting (Timetables & Salary Claims)</option>
            <option value="ENTERPRISE">🏢 Enterprise Setting (Passive Integrations & Capacity)</option>
          </select>
        </div>

        <div className="border-t border-slate-800 my-4 pt-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Administrator Account</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@organization.com"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition"
        >
          Create Account & Wallet
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:underline">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
