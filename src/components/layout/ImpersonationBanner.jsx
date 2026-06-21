import React from 'react';
import { LogOut, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ImpersonationBanner = () => {
  const { user } = useAuth();

  // With cookie-based auth, impersonation is handled by the server setting
  // the impersonated user's cookies. The admin can log out of the impersonated
  // session to return to their own account by logging in again.
  // This banner is no longer needed since we can't detect impersonation client-side
  // without localStorage flags. It is kept as a placeholder in case a server-side
  // impersonation flag is added to the user object in the future.
  
  if (!user?.is_impersonated) return null;

  const handleReturnToAdmin = () => {
    window.location.href = '/kasisalienceadministration/users';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-orange-600 dark:bg-orange-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-medium">
        <div className="flex items-center gap-2">
            <Eye className="animate-pulse" size={18} />
            You are currently impersonating this user account.
        </div>
        <button 
          onClick={handleReturnToAdmin}
          className="flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 px-4 py-1.5 rounded-full font-bold transition-colors shadow-sm whitespace-nowrap"
        >
          <LogOut size={16} /> Return to Admin
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
