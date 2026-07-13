import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-3xl space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium border border-primary/20">
            WorkToken Platform v1.0
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Make Invisible Work <span className="text-primary">Visible</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            A tamper-proof token-based contribution tracking system. Earn tokens, verify ad-hoc actions, and secure automated rewards.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition"
          >
            Access Platform
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-card border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            Register Organization
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition">
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              🎓 College Template
            </h3>
            <p className="text-sm text-muted-foreground">
              Timetable-based structured task tracking, HOD approvals, faculty progress meters, and salary release verification.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition">
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              🏢 Enterprise Template
            </h3>
            <p className="text-sm text-muted-foreground">
              Passive activity logs, tool integrations (Slack, Jira, Git), team heatmaps, and skill mapping metrics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
