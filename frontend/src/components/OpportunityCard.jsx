import { Building2, CalendarClock, ExternalLink } from "lucide-react";

const typeStyles = {
  Internship: "bg-primary-50 text-primary-700",
  Placement: "bg-blue-50 text-blue-700",
  Research: "bg-violet-50 text-violet-700",
  Hackathon: "bg-amber-50 text-amber-700",
  Deadline: "bg-rose-50 text-rose-700",
};

const statusStyles = {
  Applied: "bg-green-50 text-green-700 ring-green-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  "Not Started": "bg-muted text-muted-foreground ring-border",
  Saved: "bg-primary-50 text-primary-700 ring-primary-100",
};

function MatchRing({ value }) {
  const tone = value >= 85 ? "text-green-600" : value >= 70 ? "text-primary" : "text-muted-foreground";
  return (
    <div className="flex flex-col items-end">
      <span className={`text-lg font-semibold tracking-tight ${tone}`}>{value}%</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</span>
    </div>
  );
}

export default function OpportunityCard({ opportunity }) {
  const {
    title,
    organization,
    type = "Internship",
    matchScore = 0,
    deadline,
    skills = [],
    status = "Not Started",
    link,
  } = opportunity;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition hover:border-primary-100 hover:shadow-[0_10px_30px_-12px_rgba(79,70,229,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[type] || typeStyles.Internship}`}>
            {type}
          </span>
          <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-foreground">{title}</h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {organization}
          </p>
        </div>
        <MatchRing value={matchScore} />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarClock className="h-3.5 w-3.5" />
        <span>Deadline · <span className="font-medium text-foreground">{deadline}</span></span>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <span key={s} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80 ring-1 ring-inset ring-border">
              {s}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] || statusStyles["Not Started"]}`}>
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {status}
        </span>
        <a
          href={link || "#"}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-700"
        >
          View <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
