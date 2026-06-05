import { Link } from "react-router-dom";
import { Rocket, Mail, Sparkles, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Rocket className="h-4 w-4" /></span>
          <span className="font-semibold tracking-tight">Launchpad</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/signup" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-700">Get started</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Built for VIT students
        </span>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Your inbox is full of opportunities. <span className="text-primary">Launchpad finds them.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Connect your Gmail and let Launchpad surface internships, placements, research, hackathons and deadlines — automatically.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-700">
            Connect Gmail <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold hover:bg-muted">
            See a demo
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-24 md:grid-cols-3">
        {[
          { icon: Mail, title: "Gmail intelligence", body: "Scans incoming mail in real time and classifies opportunities by type and relevance." },
          { icon: CalendarClock, title: "Never miss a deadline", body: "Auto-extracts dates and queues smart reminders the day before they're due." },
          { icon: ShieldCheck, title: "Private by design", body: "Read-only access. Your emails never leave the secure pipeline." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700"><Icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
