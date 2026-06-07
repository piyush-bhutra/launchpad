import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import api from '../lib/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/login', { email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Rocket className="h-4 w-4" /></span>
          <span className="font-semibold tracking-tight">Launchpad</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">VIT email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vitstudent.ac.in"
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-3 w-full rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
