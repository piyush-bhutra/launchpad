import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import api from '../lib/api.js';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        await api.post('/api/profile', { skills: [] });
      } catch (err) {
        console.error('Profile setup error:', err);
        navigate('/login', { replace: true });
        return;
      }
      
      // Fire scan without awaiting - it runs in background
      api.post('/api/opportunities/scan').catch(err => 
        console.error('Scan trigger error:', err)
      );
      
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
