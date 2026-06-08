const isLocalOrStaging = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('staging') ||
  window.location.hostname.includes('vercel.app')
);

export const PRELAUNCH_WAITLIST_MODE = import.meta.env.VITE_PRELAUNCH_WAITLIST_MODE !== undefined
  ? import.meta.env.VITE_PRELAUNCH_WAITLIST_MODE === 'true'
  : !isLocalOrStaging;
