import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../lib/api.js';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      localStorage.setItem('launchpad_token', token);

      try {
        await api.post('/api/profile', { skills: [] });
        await api.post('/api/opportunities/scan');
      } catch (err) {
        console.error('Post-OAuth setup error:', err.response?.data?.message || err.message);
      }

      navigate('/dashboard', { replace: true });
    };

    completeAuth();
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40">
      <LoadingSpinner label="Signing you in" />
    </div>
  );
}
