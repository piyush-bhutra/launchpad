import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api, { formatDeadline } from '../lib/api.js';
import { Mail } from 'lucide-react';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/opportunities');
        const sorted = [...data].sort(
          (a, b) => new Date(b.extractedAt || b.sourceEmailDate) - new Date(a.extractedAt || a.sourceEmailDate)
        );
        setItems(sorted);
      } catch (err) {
        console.error('History fetch error:', err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Scan history</h1>
        <p className="mt-1 text-muted-foreground">Emails Launchpad processed from your inbox.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          {loading ? (
            <LoadingSpinner label="Loading scan history" />
          ) : items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No processed emails yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i._id} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{i.title || 'Untitled opportunity'}</p>
                      <p className="text-xs text-muted-foreground">{i.organization || 'Unknown sender'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">{i.type || 'Other'}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDeadline(i.sourceEmailDate || i.extractedAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
