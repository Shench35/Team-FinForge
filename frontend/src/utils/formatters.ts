export const scoreToColor = (score: number) =>
  score >= 80 ? '#006c4e' : score >= 50 ? '#f59e0b' : '#ba1a1a';

export const scoreToVerdict = (score: number) =>
  score >= 80 ? 'LIKELY_AUTHENTIC' : score >= 50 ? 'SUSPICIOUS' : 'HIGH_RISK';

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const truncateFilename = (name: string, max = 30) =>
  name.length > max ? name.slice(0, max - 3) + '...' : name;
