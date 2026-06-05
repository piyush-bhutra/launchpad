import { NavLink, Link, useNavigate } from "react-router-dom";
import { Rocket, LayoutDashboard, Briefcase, CalendarClock, FileText, Sparkles, History as HistoryIcon } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/deadlines", label: "Deadlines", icon: CalendarClock },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/career", label: "Career AI", icon: Sparkles },
  { to: "/history", label: "History", icon: HistoryIcon },
];

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">Launchpad</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
