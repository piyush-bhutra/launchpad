export default function SkillBadge({ skill }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80 ring-1 ring-inset ring-border">
      {skill}
    </span>
  );
}
