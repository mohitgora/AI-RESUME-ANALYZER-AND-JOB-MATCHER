export const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-accent-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

export const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-accent-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getScoreLabel = (score: number) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
};

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + '...' : str;

export const formatPercent = (val: number) => `${Math.round(val)}%`;

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
