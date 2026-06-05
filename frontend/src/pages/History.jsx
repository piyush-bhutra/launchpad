import Navbar from "../components/Navbar.jsx";
import { Mail } from "lucide-react";

const items = [
  { subject: "Atlassian — OA invitation", from: "placement@vit.ac.in", date: "Jun 5", tag: "Placement" },
  { subject: "SIH 2026 registrations open", from: "sih@aicte.in", date: "Jun 4", tag: "Hackathon" },
  { subject: "Google STEP applications", from: "step@google.com", date: "Jun 3", tag: "Internship" },
  { subject: "IISc summer research call", from: "research@iisc.ac.in", date: "Jun 1", tag: "Research" },
];

export default function History() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Scan history</h1>
        <p className="mt-1 text-muted-foreground">Emails Launchpad processed from your inbox.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <ul className="divide-y divide-border">
            {items.map((i) => (
              <li key={i.subject} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{i.subject}</p>
                    <p className="text-xs text-muted-foreground">{i.from}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">{i.tag}</span>
                  <span className="text-xs text-muted-foreground">{i.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
