import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../lib/api.js';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        await api.post('/api/profile', {});
        await api.post('/api/opportunities/scan');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Post-OAuth setup error:', err.response?.data?.message || err.message);
        navigate('/login', { replace: true });
      }
    };

    completeAuth();
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40">
      <LoadingSpinner label="Signing you in" />
    </div>
  );
}
