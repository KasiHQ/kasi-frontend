const isLocalOrStaging = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('staging') ||
  window.location.hostname.includes('vercel.app')
);

export const PRELAUNCH_WAITLIST_MODE = import.meta.env.VITE_PRELAUNCH_WAITLIST_MODE !== undefined
  ? import.meta.env.VITE_PRELAUNCH_WAITLIST_MODE === 'true'
  : false;

export const META_APP_ID = import.meta.env.VITE_META_APP_ID || '2200339807370917';
export const META_WHATSAPP_CONFIG_ID = import.meta.env.VITE_META_WHATSAPP_CONFIG_ID || '1409405861146483';
export const META_HOSTED_ONBOARD_URL = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=${META_APP_ID}&config_id=${META_WHATSAPP_CONFIG_ID}`;

