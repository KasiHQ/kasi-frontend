import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

const LAYOUT_KEY = 'bfm-layout-mode';
const SIDEBAR_COLLAPSED_KEY = 'bfm-sidebar-collapsed';

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem(LAYOUT_KEY) || 'topbar';
    } catch {
      return 'topbar';
    }
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, layout);
    } catch {}
  }, [layout]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed);
    } catch {}
  }, [sidebarCollapsed]);

  const toggleLayout = () => {
    setLayout((prev) => (prev === 'sidebar' ? 'topbar' : 'sidebar'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout, toggleLayout, sidebarCollapsed, setSidebarCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider');
  return ctx;
};

export default LayoutContext;
