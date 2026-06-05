import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import OpportunityCard from "../components/OpportunityCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Gauge,
  Sparkles,
  Inbox,
  RefreshCw,
  Search,
} from "lucide-react";

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Software Engineering Intern — Summer 2026",
    organization: "Google",
    type: "Internship",
    matchScore: 92,
    deadline: "Jun 18, 2026",
    skills: ["DSA", "Python", "System Design", "Distributed Systems"],
    status: "Applied",
    link: "#",
  },
  {
    id: 2,
    title: "Full-time SDE — Graduate Program",
    organization: "Atlassian",
    type: "Placement",
    matchScore: 87,
    deadline: "Jun 14, 2026",
    skills: ["Java", "React", "AWS"],
    status: "In Progress",
    link: "#",
  },
  {
    id: 3,
    title: "ML Research Intern — Vision Lab",
    organization: "IISc Bangalore",
    type: "Research",
    matchScore: 81,
    deadline: "Jun 22, 2026",
    skills: ["PyTorch", "Computer Vision", "Python"],
    status: "Saved",
    link: "#",
  },
  {
    id: 4,
    title: "Smart India Hackathon 2026",
    organization: "Ministry of Education",
    type: "Hackathon",
    matchScore: 74,
    deadline: "Jul 02, 2026",
    skills: ["Team", "MVP", "Pitch"],
    status: "Not Started",
    link: "#",
  },
  {
    id: 5,
    title: "Quant Research Intern",
    organization: "Tower Research Capital",
    type: "Internship",
    matchScore: 78,
    deadline: "Jun 25, 2026",
    skills: ["C++", "Probability", "Statistics", "Python"],
    status: "Saved",
    link: "#",
  },
  {
    id: 6,
    title: "Product Analyst — Campus Hire",
    organization: "Razorpay",
    type: "Placement",
    matchScore: 69,
    deadline: "Jun 30, 2026",
    skills: ["SQL", "Excel", "Analytics"],
    status: "Not Started",
    link: "#",
  },
];

const STATS = [
  { label: "Total Opportunities", value: "128", icon: Briefcase, hint: "+18 this week" },
  { label: "Upcoming Deadlines", value: "7", icon: CalendarClock, hint: "3 within 5 days" },
  { label: "Applied", value: "12", icon: CheckCircle2, hint: "4 awaiting reply" },
  { label: "Avg. Match Score", value: "82%", icon: Gauge, hint: "+6% vs last month" },
  { label: "New Opportunities", value: "24", icon: Sparkles, hint: "Last 24 hours" },
];

function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 transition hover:border-primary-100 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-700">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white py-16 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700">
        <Inbox className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">No opportunities yet</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
        Launchpad will surface internships, placements, research and hackathons as soon as new emails land in your inbox.
      </p>
      <button
        onClick={onRefresh}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700"
      >
        <RefreshCw className="h-4 w-4" /> Scan inbox now
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setOpportunities(MOCK_OPPORTUNITIES);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setOpportunities([]);
    setTimeout(() => {
      setOpportunities(MOCK_OPPORTUNITIES);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back, Aarav</h1>
            <p className="mt-1 text-muted-foreground">
              Here's what Launchpad surfaced from your inbox today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search opportunities…"
                className="w-72 rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </section>

        {/* Recent opportunities */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Recent Opportunities</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Curated from your latest inbox scan, ranked by match score.
              </p>
            </div>
            <a href="/opportunities" className="text-sm font-medium text-primary hover:text-primary-700">
              View all →
            </a>
          </div>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner label="Scanning your inbox" />
            ) : opportunities.length === 0 ? (
              <EmptyState onRefresh={handleRefresh} />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {opportunities.slice(0, 6).map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
