import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import OpportunityCard from "../components/OpportunityCard.jsx";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";

const MOCK = [
  { id: 1, title: "Software Engineering Intern — Summer 2026", organization: "Google", type: "Internship", matchScore: 92, deadline: "Jun 18, 2026", skills: ["DSA", "Python", "System Design"], status: "Applied" },
  { id: 2, title: "Full-time SDE — Graduate Program", organization: "Atlassian", type: "Placement", matchScore: 87, deadline: "Jun 14, 2026", skills: ["Java", "React", "AWS"], status: "In Progress" },
  { id: 3, title: "ML Research Intern — Vision Lab", organization: "IISc Bangalore", type: "Research", matchScore: 81, deadline: "Jun 22, 2026", skills: ["PyTorch", "CV", "Python"], status: "Saved" },
  { id: 4, title: "Smart India Hackathon 2026", organization: "Ministry of Education", type: "Hackathon", matchScore: 74, deadline: "Jul 02, 2026", skills: ["Team", "MVP"], status: "Not Started" },
  { id: 5, title: "Quant Research Intern", organization: "Tower Research Capital", type: "Internship", matchScore: 78, deadline: "Jun 25, 2026", skills: ["C++", "Probability", "Python"], status: "Saved" },
  { id: 6, title: "Product Analyst — Campus Hire", organization: "Razorpay", type: "Placement", matchScore: 69, deadline: "Jun 30, 2026", skills: ["SQL", "Excel"], status: "Not Started" },
  { id: 7, title: "Frontend Engineer Intern", organization: "Vercel", type: "Internship", matchScore: 88, deadline: "Jul 10, 2026", skills: ["React", "TypeScript", "Next.js"], status: "Saved" },
  { id: 8, title: "Climate Tech Hackathon", organization: "MIT Solve", type: "Hackathon", matchScore: 64, deadline: "Jul 15, 2026", skills: ["Sustainability", "MVP"], status: "Not Started" },
  { id: 9, title: "NLP Research Assistant", organization: "IIIT Hyderabad", type: "Research", matchScore: 83, deadline: "Jun 28, 2026", skills: ["Python", "Transformers"], status: "In Progress" },
  { id: 10, title: "Backend SDE — New Grad", organization: "Stripe", type: "Placement", matchScore: 90, deadline: "Jul 05, 2026", skills: ["Go", "Distributed Systems"], status: "Applied" },
];

const TYPES = ["All", "Internship", "Placement", "Research", "Hackathon"];
const MATCH_RANGES = [
  { label: "Any match", min: 0 },
  { label: "70%+", min: 70 },
  { label: "80%+", min: 80 },
  { label: "90%+", min: 90 },
];

export default function Opportunities() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [minMatch, setMinMatch] = useState(0);

  const results = useMemo(() => {
    return MOCK.filter((o) => {
      const matchesType = type === "All" || o.type === type;
      const matchesScore = o.matchScore >= minMatch;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.skills.some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesScore && matchesQuery;
    });
  }, [query, type, minMatch]);

  const reset = () => { setQuery(""); setType("All"); setMinMatch(0); };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Opportunities</h1>
          <p className="mt-1 text-muted-foreground">
            Every opportunity Launchpad extracted from your inbox, in one place.
          </p>
        </div>

        {/* Filters bar */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, company or skill…"
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    type === t
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-white text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Match score
            </span>
            {MATCH_RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setMinMatch(r.min)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  minMatch === r.min
                    ? "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-100"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{results.length}</span> of{" "}
            <span className="font-semibold text-foreground">{MOCK.length}</span> opportunities
          </p>
          {(query || type !== "All" || minMatch > 0) && (
            <button onClick={reset} className="text-sm font-medium text-primary hover:text-primary-700">
              Clear filters
            </button>
          )}
        </div>

        {/* Grid / empty */}
        <section className="mt-4">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700">
                <Inbox className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">No opportunities match</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                Try a different keyword, loosen the match score, or reset the filters to see everything.
              </p>
              <button
                onClick={reset}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
