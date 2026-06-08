import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OpportunityCard from '../components/OpportunityCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api, { mapOpportunity } from '../lib/api.js';
import { Search, SlidersHorizontal, Inbox } from 'lucide-react';

const TYPES = ['All', 'Internship', 'Placement', 'Research', 'Hackathon'];
const MATCH_RANGES = [
  { label: 'Any match', min: 0 },
  { label: '70%+', min: 70 },
  { label: '80%+', min: 80 },
  { label: '90%+', min: 90 },
];

export default function Opportunities() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const params = {};
        if (type !== 'All') params.type = type;
        if (query.trim()) params.search = query.trim();

        const { data } = await api.get('/api/opportunities', { params });
        console.log('Opportunities API response:', data);
        const opportunitiesArray = data.opportunities || data;
        setOpportunities(opportunitiesArray.map(mapOpportunity));
      } catch (err) {
        console.error('Opportunities fetch error:', err.message);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchOpportunities, 300);
    return () => clearTimeout(debounce);
  }, [query, type]);

  const results = useMemo(() => {
    return opportunities.filter((o) => o.matchScore >= minMatch);
  }, [opportunities, minMatch]);

  const reset = () => { setQuery(''); setType('All'); setMinMatch(0); };

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
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-white text-muted-foreground hover:text-foreground'
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
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-100'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{results.length}</span> of{' '}
            <span className="font-semibold text-foreground">{opportunities.length}</span> opportunities
          </p>
          {(query || type !== 'All' || minMatch > 0) && (
            <button onClick={reset} className="text-sm font-medium text-primary hover:text-primary-700">
              Clear filters
            </button>
          )}
        </div>

        <section className="mt-4">
          {loading ? (
            <LoadingSpinner label="Loading opportunities" />
          ) : results.length === 0 ? (
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
