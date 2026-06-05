import Navbar from "../components/Navbar.jsx";
import SkillBadge from "../components/SkillBadge.jsx";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

const resumes = [
  { name: "Aarav_SDE_Resume.pdf", version: "v3", updated: "2 days ago", primary: true },
  { name: "Aarav_Research_CV.pdf", version: "v1", updated: "3 weeks ago" },
];

const skills = ["React", "Python", "PyTorch", "System Design", "SQL", "TypeScript", "Docker"];

export default function ResumeManager() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Resume Manager</h1>
            <p className="mt-1 text-muted-foreground">Manage versions and let Launchpad tailor applications.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700">
            <Upload className="h-4 w-4" /> Upload resume
          </button>
        </div>

        <section className="mt-8 space-y-3">
          {resumes.map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.version} · updated {r.updated}</p>
                </div>
              </div>
              {r.primary ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Primary
                </span>
              ) : (
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Set primary</button>
              )}
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold">Detected skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">Extracted from your latest resume.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => <SkillBadge key={s} skill={s} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
