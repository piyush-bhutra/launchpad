import Navbar from "../components/Navbar.jsx";
import DeadlineCard from "../components/DeadlineCard.jsx";
import { CalendarCheck2, CalendarClock, CalendarDays, History } from "lucide-react";

const DATA = {
  today: [
    { id: 1, title: "Atlassian OA submission", organization: "Atlassian", type: "Placement", dueDate: "Today, 11:59 PM", dueLabel: "Today" },
    { id: 2, title: "Google STEP application", organization: "Google", type: "Internship", dueDate: "Today, 6:00 PM", dueLabel: "Today" },
  ],
  thisWeek: [
    { id: 3, title: "Microsoft Engage cover letter", organization: "Microsoft", type: "Internship", dueDate: "Jun 10, 2026", dueLabel: "in 3 days" },
    { id: 4, title: "Goldman Sachs final round prep", organization: "Goldman Sachs", type: "Placement", dueDate: "Jun 11, 2026", dueLabel: "in 4 days" },
    { id: 5, title: "Smart India Hackathon team registration", organization: "MoE", type: "Hackathon", dueDate: "Jun 12, 2026", dueLabel: "in 5 days" },
  ],
  thisMonth: [
    { id: 6, title: "ISRO research proposal", organization: "ISRO", type: "Research", dueDate: "Jun 22, 2026", dueLabel: "in 17 days" },
    { id: 7, title: "Stripe new-grad SDE", organization: "Stripe", type: "Placement", dueDate: "Jun 28, 2026", dueLabel: "in 23 days" },
  ],
  expired: [
    { id: 8, title: "Adobe MAX student pass", organization: "Adobe", type: "Internship", dueDate: "May 28, 2026", dueLabel: "expired" },
    { id: 9, title: "DRDO summer internship", organization: "DRDO", type: "Research", dueDate: "May 20, 2026", dueLabel: "expired" },
  ],
};

function SectionHeader({ icon: Icon, title, count, tone = "default" }) {
  const tones = {
    default: "bg-primary-50 text-primary-700",
    urgent: "bg-red-50 text-red-600",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{count}</span>
      </div>
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function Deadlines() {
  const { today, thisWeek, thisMonth, expired } = DATA;
  const hasAny = today.length + thisWeek.length + thisMonth.length + expired.length > 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Deadlines</h1>
          <p className="mt-1 text-muted-foreground">
            Auto-detected from your opportunity emails. Don't let the good ones slip.
          </p>
        </div>

        {!hasAny ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-white py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700">
              <CalendarCheck2 className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">You're all caught up</h3>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Nothing on the horizon. New deadlines will appear here automatically as Launchpad scans your inbox.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* Today — urgent */}
            <section>
              <SectionHeader icon={CalendarClock} title="Today" count={today.length} tone="urgent" />
              <div className="mt-4 space-y-3">
                {today.length === 0 ? (
                  <EmptySection message="Nothing due today. Breathe." />
                ) : (
                  today.map((d) => <DeadlineCard key={d.id} deadline={d} variant="urgent" />)
                )}
              </div>
            </section>

            {/* This week */}
            <section>
              <SectionHeader icon={CalendarDays} title="This Week" count={thisWeek.length} />
              <div className="mt-4 space-y-3">
                {thisWeek.length === 0 ? (
                  <EmptySection message="No deadlines this week." />
                ) : (
                  thisWeek.map((d) => <DeadlineCard key={d.id} deadline={d} />)
                )}
              </div>
            </section>

            {/* This month */}
            <section>
              <SectionHeader icon={CalendarDays} title="This Month" count={thisMonth.length} />
              <div className="mt-4 space-y-3">
                {thisMonth.length === 0 ? (
                  <EmptySection message="No deadlines later this month." />
                ) : (
                  thisMonth.map((d) => <DeadlineCard key={d.id} deadline={d} />)
                )}
              </div>
            </section>

            {/* Expired — muted */}
            <section>
              <SectionHeader icon={History} title="Expired" count={expired.length} tone="muted" />
              <div className="mt-4 space-y-2">
                {expired.length === 0 ? (
                  <EmptySection message="Nothing expired. Nice work." />
                ) : (
                  expired.map((d) => <DeadlineCard key={d.id} deadline={d} variant="expired" />)
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
