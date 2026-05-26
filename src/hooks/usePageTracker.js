import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

// Helper to generate a fast, clean client session UUID
const generateSessionId = () => {
  try {
    if (window.crypto && window.crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {}
  // Safe string fallback
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const usePageTracker = () => {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    // Avoid double tracking in React StrictMode development environments
    if (lastPath.current === location.pathname) {
      return;
    }
    
    // Admin paths should not log traffic stats to avoid inflating merchant traffic records
    if (location.pathname.startsWith('/kasisalienceadministration')) {
      return;
    }

    lastPath.current = location.pathname;

    // Get or initialize unique session key (privacy-compliant local tracker ID)
    let sessionId = localStorage.getItem('kasi_analytics_session');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('kasi_analytics_session', sessionId);
    }

    const logVisit = async () => {
      try {
        await api.post('/api/analytics/track', {
          path: location.pathname,
          referrer: document.referrer || 'Direct',
          session_id: sessionId
        });
      } catch (err) {
        // Silent catch to prevent console cluttering on dev/offline environments
      }
    };

    // Log the visit asynchronously
    logVisit();
  }, [location]);
};

export default usePageTracker;
