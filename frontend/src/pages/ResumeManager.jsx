import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../lib/api.js';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

function formatUploadedAt(date) {
  if (!date) return 'Not uploaded yet';
  const d = new Date(date);
  const diffDays = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export default function ResumeManager() {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/profile');
      setProfile(data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Profile fetch error:', err.message);
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(data.message);
      await fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const skills = profile?.skills || [];
  const hasResume = Boolean(profile?.resumeUploadedAt);

  const resumes = hasResume
    ? [{ name: 'Uploaded Resume.pdf', version: 'Latest', updated: formatUploadedAt(profile.resumeUploadedAt), primary: true }]
    : [];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Resume Manager</h1>
            <p className="mt-1 text-muted-foreground">Manage versions and let Launchpad tailor applications.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload resume'}
          </button>
          <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
        </div>

        {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}

        <section className="mt-8 space-y-3">
          {loading ? (
            <LoadingSpinner label="Loading resume" />
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
              No resume uploaded yet. Upload a PDF to extract skills and improve match scores.
            </div>
          ) : (
            resumes.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.version} · updated {r.updated}</p>
                  </div>
                </div>
                {r.primary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Primary
                  </span>
                )}
              </div>
            ))
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold">Detected skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">Extracted from your profile and resume.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((s) => <SkillBadge key={s} skill={s} />)
            ) : (
              <p className="text-sm text-muted-foreground">No skills detected yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
