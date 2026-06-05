import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import DeadlineCard from '../components/DeadlineCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api, { mapDeadline } from '../lib/api.js';
import { CalendarCheck2, CalendarClock, CalendarDays, History } from 'lucide-react';

function SectionHeader({ icon: Icon, title, count, tone = 'default' }) {
  const tones = {
    default: 'bg-primary-50 text-primary-700',
    urgent: 'bg-red-50 text-red-600',
    muted: 'bg-muted text-muted-foreground',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{count}</span>
      </div>
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function Deadlines() {
  const [data, setData] = useState({ today: [], thisWeek: [], thisMonth: [], expired: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const { data: res } = await api.get('/api/opportunities/deadlines');
        setData({
          today: res.today.map(mapDeadline),
          thisWeek: res.thisWeek.map(mapDeadline),
          thisMonth: res.thisMonth.map(mapDeadline),
          expired: res.expired.map(mapDeadline),
        });
      } catch (err) {
        console.error('Deadlines fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  const { today, thisWeek, thisMonth, expired } = data;
  const hasAny = today.length + thisWeek.length + thisMonth.length + expired.length > 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Deadlines</h1>
          <p className="mt-1 text-muted-foreground">
            Auto-detected from your opportunity emails. Don't let the good ones slip.
          </p>
        </div>

        {loading ? (
          <div className="mt-10">
            <LoadingSpinner label="Loading deadlines" />
          </div>
        ) : !hasAny ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-white py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700">
              <CalendarCheck2 className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">You're all caught up</h3>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Nothing on the horizon. New deadlines will appear here automatically as Launchpad scans your inbox.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            <section>
              <SectionHeader icon={CalendarClock} title="Today" count={today.length} tone="urgent" />
              <div className="mt-4 space-y-3">
                {today.length === 0 ? (
                  <EmptySection message="Nothing due today. Breathe." />
                ) : (
                  today.map((d) => <DeadlineCard key={d.id} deadline={d} variant="urgent" />)
                )}
              </div>
            </section>

            <section>
              <SectionHeader icon={CalendarDays} title="This Week" count={thisWeek.length} />
              <div className="mt-4 space-y-3">
                {thisWeek.length === 0 ? (
                  <EmptySection message="No deadlines this week." />
                ) : (
                  thisWeek.map((d) => <DeadlineCard key={d.id} deadline={d} />)
                )}
              </div>
            </section>

            <section>
              <SectionHeader icon={CalendarDays} title="This Month" count={thisMonth.length} />
              <div className="mt-4 space-y-3">
                {thisMonth.length === 0 ? (
                  <EmptySection message="No deadlines later this month." />
                ) : (
                  thisMonth.map((d) => <DeadlineCard key={d.id} deadline={d} />)
                )}
              </div>
            </section>

            <section>
              <SectionHeader icon={History} title="Expired" count={expired.length} tone="muted" />
              <div className="mt-4 space-y-2">
                {expired.length === 0 ? (
                  <EmptySection message="Nothing expired. Nice work." />
                ) : (
                  expired.map((d) => <DeadlineCard key={d.id} deadline={d} variant="expired" />)
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
