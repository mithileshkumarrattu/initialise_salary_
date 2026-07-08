import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 border border-emerald-500/20">
            WorkToken Platform v1.0
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Make Invisible Work Visible
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            A tamper-proof token-based contribution tracking system. Earn tokens, verify ad-hoc actions, and secure automated rewards.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition"
          >
            Access Platform
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-slate-900 border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Register Organization
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-white mb-2">🎓 College Template</h3>
            <p className="text-sm text-slate-400">
              Timetable-based structured task tracking, HOD approvals, faculty progress meters, and salary release verification.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-white mb-2">🏢 Enterprise Template</h3>
            <p className="text-sm text-slate-400">
              Passive activity logs, tool integrations (Slack, Jira, Git), team heatmaps, and skill mapping metrics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
