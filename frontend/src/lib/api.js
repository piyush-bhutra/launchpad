import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('launchpad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('launchpad_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function formatDeadline(date) {
  if (!date) return 'No deadline';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDueLabel(deadline) {
  const now = new Date();
  const d = new Date(deadline);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  if (d < todayStart) return 'expired';
  if (d <= todayEnd) return 'Today';

  const diffDays = Math.ceil((d - todayEnd) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Tomorrow';
  return `in ${diffDays} days`;
}

const STATUS_MAP = {
  Applied: 'Applied',
  Interested: 'Saved',
  New: 'Not Started',
  Rejected: 'Not Started',
  Completed: 'Applied',
  Ignored: 'Not Started',
};

export function mapOpportunity(opp) {
  return {
    id: opp._id,
    title: opp.title || 'Untitled opportunity',
    organization: opp.organization || 'Unknown',
    type: opp.type || 'Other',
    matchScore: opp.matchPercentage ?? 0,
    deadline: formatDeadline(opp.deadline),
    skills: opp.requiredSkills || [],
    status: STATUS_MAP[opp.status] || opp.status || 'Not Started',
    link: opp.applyLink || opp.gmailDeepLink || '#',
  };
}

export function mapDeadline(opp) {
  return {
    id: opp._id,
    title: opp.title || 'Untitled opportunity',
    organization: opp.organization || 'Unknown',
    type: opp.type || 'Other',
    dueDate: formatDeadline(opp.deadline),
    dueLabel: getDueLabel(opp.deadline),
    link: opp.applyLink || opp.gmailDeepLink || '#',
  };
}

export default api;
