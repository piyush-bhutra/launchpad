import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import api from '../lib/api.js';
import { Sparkles, TrendingUp, Target, BookOpen } from 'lucide-react';

export default function CareerIntelligence() {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          api.get('/api/opportunities/stats'),
          api.get('/api/profile').catch(() => ({ data: null })),
        ]);
        setStats(statsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error('Career intelligence fetch error:', err.message);
      }
    };

    fetchData();
  }, []);

  const topType = stats?.byType
    ? Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]
    : null;

  const insights = [
    {
      icon: TrendingUp,
      title: topType ? `Trending: ${topType[0]} roles` : 'Trending roles for you',
      body: topType
        ? `${topType[1]} ${topType[0]} opportunities detected from your inbox. Consider tailoring your resume.`
        : 'Connect Gmail and complete onboarding to see trending role insights.',
    },
    {
      icon: Target,
      title: 'Your match strength',
      body: stats
        ? `Average match score is ${stats.averageMatchPercentage}%. ${stats.byMatchStatus?.['High Match'] || 0} high-match opportunities found.`
        : 'Upload your resume and add skills to unlock match insights.',
    },
    {
      icon: BookOpen,
      title: 'Skill to learn next',
      body: profile?.skills?.length
        ? `Your profile lists ${profile.skills.length} skills. Keep refining them as new opportunities arrive.`
        : 'Add skills to your profile to get personalized skill recommendations.',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700"><Sparkles className="h-5 w-5" /></span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Career Intelligence</h1>
            <p className="mt-1 text-muted-foreground">AI insights from thousands of placement signals.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {insights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-border bg-gradient-to-br from-primary-50 to-white p-8">
          <h2 className="text-xl font-semibold tracking-tight">Ask Career AI</h2>
          <p className="mt-1 text-sm text-muted-foreground">Get personalized prep plans, mock interviews and resume reviews.</p>
          <div className="mt-5 flex gap-2">
            <input placeholder="e.g. How do I prep for Atlassian SDE in 2 weeks?"
              className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2" />
            <button className="rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-700">Ask</button>
          </div>
        </section>
      </main>
    </div>
  );
}
