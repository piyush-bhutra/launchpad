import { AlertCircle, CalendarClock, Building2, ArrowUpRight, History } from "lucide-react";

const typeStyles = {
  Internship: "bg-primary-50 text-primary-700",
  Placement: "bg-blue-50 text-blue-700",
  Research: "bg-violet-50 text-violet-700",
  Hackathon: "bg-amber-50 text-amber-700",
};

export default function DeadlineCard({ deadline, variant = "default" }) {
  const { title, organization, type, dueLabel, dueDate, link } = deadline;

  if (variant === "urgent") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-[0_8px_24px_-12px_rgba(239,68,68,0.35)]">
        <span className="absolute inset-y-0 left-0 w-1 bg-red-500" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Due today
                </span>
                {type && (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${typeStyles[type] || typeStyles.Internship}`}>
                    {type}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">{title}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {organization}
              </p>
            </div>
          </div>
          <a href={link || "#"} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
            Act now <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (variant === "expired") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4 opacity-80">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground">
            <History className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground line-through">{title}</p>
            <p className="text-xs text-muted-foreground">{organization} · expired {dueDate}</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border">
          Expired
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 transition hover:border-primary-100 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            {type && (
              <span className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${typeStyles[type] || typeStyles.Internship}`}>
                {type}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{organization} · {dueDate}</p>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {dueLabel}
      </span>
    </div>
  );
}
