import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

const SubscriptionGate = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user has access, render children normally
  if (!user || user.can_perform_actions) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    navigate('/settings?tab=billing');
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Sleek, Brand-Aligned Trial Expiration Banner */}
      <div className="bg-[#FFFDF5] dark:bg-amber-950/20 border border-[#FEF08A]/70 rounded-xl py-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-none select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-[#B45309] mr-2">Trial Expired (View-Only Mode)</span>
            <span className="text-gray-500 font-semibold">Your free trial has ended. Access is restricted to view-only.</span>
          </div>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
          <button
            onClick={() => navigate('/settings')}
            className="text-[11px] font-extrabold text-gray-500 hover:text-dark transition-colors cursor-pointer"
          >
            Settings
          </button>
          <button
            onClick={handleUpgrade}
            className="px-3.5 py-1.5 bg-[#1A7A4A] hover:bg-[#0F5533] text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            Upgrade to Premium
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Gated Page Content - Rendered fully visible but view-only */}
      <div className="pointer-events-none select-none opacity-[0.93] transition-opacity duration-300 relative">
        <div className="absolute inset-0 z-40 bg-transparent cursor-not-allowed" title="Account locked - Upgrade to unlock actions" />
        {children}
      </div>
    </div>
  );
};

export default SubscriptionGate;
