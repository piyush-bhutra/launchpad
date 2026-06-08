import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const verify = async () => {
      try {
        await api.post(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        {status === 'loading' && (
          <div>
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
          </div>
        )}

        {status === 'invalid' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold text-red-600">Invalid Link</h2>
            <p className="mb-6 text-gray-600">Invalid verification link.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-600"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold text-green-600">Email Verified!</h2>
            <p className="mb-6 text-gray-600">Email verified successfully. You can now log in.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-600"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 className="mb-2 text-xl font-semibold text-red-600">Verification Failed</h2>
            <p className="mb-6 text-gray-600">{errorMsg}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-600"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
