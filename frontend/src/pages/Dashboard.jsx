import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import OpportunityCard from '../components/OpportunityCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api, { mapOpportunity } from '../lib/api.js';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Gauge,
  Sparkles,
  Inbox,
  RefreshCw,
  Search,
  Box,
} from 'lucide-react';
import Cityscape from '../components/Cityscape.jsx';

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
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState('');
  const [is3DMode, setIs3DMode] = useState(true);

  const fetchData = async (searchQuery = '') => {
    setLoading(true);
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const [oppRes, statsRes, profileRes] = await Promise.all([
        api.get('/api/opportunities', { params }),
        api.get('/api/opportunities/stats'),
        api.get('/api/profile').catch(() => ({ data: null })),
      ]);

      setOpportunities(oppRes.data.map(mapOpportunity));
      setStats(statsRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err.message);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await api.post('/api/opportunities/scan');
    } catch (err) {
      console.error('Inbox scan error:', err.response?.data?.message || err.message);
    }
    await fetchData(search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  const upcomingCount =
    (stats?.byStatus?.New || 0) + (stats?.byStatus?.Interested || 0);

  const statCards = stats
    ? [
        { label: 'Total Opportunities', value: String(stats.total), icon: Briefcase, hint: 'From your inbox' },
        { label: 'Upcoming Deadlines', value: String(upcomingCount), icon: CalendarClock, hint: 'Active opportunities' },
        { label: 'Applied', value: String(stats.byStatus?.Applied || 0), icon: CheckCircle2, hint: 'Applications submitted' },
        { label: 'Avg. Match Score', value: `${stats.averageMatchPercentage}%`, icon: Gauge, hint: 'Based on your profile' },
        { label: 'New Opportunities', value: String(stats.byStatus?.New || 0), icon: Sparkles, hint: 'Awaiting review' },
      ]
    : [];

  const displayName = profile?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {displayName}</h1>
            <p className="mt-1 text-muted-foreground">
              Here's what Launchpad surfaced from your inbox today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities…"
                className="w-72 rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </form>
            <button
              onClick={() => setIs3DMode(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              <Box className="h-4 w-4" /> Enter 3D City
            </button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {is3DMode && (
          <Cityscape 
            opportunities={opportunities} 
            onClose={() => setIs3DMode(false)} 
          />
        )}

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Recent Opportunities</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Curated from your latest inbox scan, ranked by match score.
              </p>
            </div>
            <Link to="/opportunities" className="text-sm font-medium text-primary hover:text-primary-700">
              View all →
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner label="Scanning your inbox" />
            ) : opportunities.length === 0 ? (
              <EmptyState onRefresh={handleRefresh} />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...opportunities]
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .slice(0, 6)
                  .map((o) => (
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
