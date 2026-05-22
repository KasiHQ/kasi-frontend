import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const BillingCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const { addToast } = useToast();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your Kasi subscription activation...');
  const [planInfo, setPlanInfo] = useState({ tier: '', type: '' });

  useEffect(() => {
    verifySubscription();
  }, []);

  const verifySubscription = async () => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      setStatus('error');
      setMessage('No billing transaction reference was found. Please contact Kasi support.');
      return;
    }

    try {
      // Decode potential plan details from the reference SUB-userId-tier-type-timestamp-nonce
      const parts = reference.split('-');
      if (parts[0] === 'SUB' && parts.length >= 4) {
        setPlanInfo({
          tier: parts[2],
          type: parts[3]
        });
      }

      const res = await api.post('/api/billing/verify-subscription', {
        reference
      }, {
        headers: {
          'Idempotency-Key': `verify_sub_${reference}`
        }
      });
      
      setStatus('success');
      setMessage('Your monthly subscription is active! Your brand-new business limits have been unlocked.');
      
      // Update global user details so the sidebar, settings, and badges update immediately
      if (fetchUser) {
        await fetchUser();
      }
      
      addToast('Subscription activated successfully!', 'success');
      
      // Automatically redirect to Billing Settings after 5 seconds
      setTimeout(() => {
        navigate('/settings?tab=billing');
      }, 5000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.error || 'We could not verify your subscription payment at this time. Please try again.');
    }
  };

  const getPlanDetails = () => {
    if (!planInfo.tier) return 'SaaS Plan';
    const tierName = planInfo.tier.charAt(0).toUpperCase() + planInfo.tier.slice(1);
    const typeName = planInfo.type.charAt(0).toUpperCase() + planInfo.type.slice(1);
    return `${tierName} ${typeName} Plan`;
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-tr from-green-50/50 via-white to-emerald-50/30">
      {/* Decorative premium radial flares */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50 p-8 max-w-md w-full text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Pulsing Stars / Sparkles header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-lime-400 blur-sm opacity-30 animate-pulse" />
            <div className="relative w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles size={22} className="animate-spin duration-3000" />
            </div>
          </div>
        </div>

        {/* ── VERIFYING STATE ──────────────────── */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center space-y-5">
            <div className="relative py-2">
              <Loader2 size={56} className="animate-spin text-primary relative z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 rounded-full blur-md" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-dark tracking-tight">Activating Your Plan</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{message}</p>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-lime-500 h-full rounded-full animate-infinite-loading" style={{ width: '45%' }} />
            </div>
          </div>
        )}

        {/* ── SUCCESS STATE ────────────────────── */}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-5">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative animate-bounce">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <CheckCircle size={44} className="text-primary relative z-10" />
            </div>
            
            <div>
              <span className="px-3.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/25 rounded-full inline-block uppercase tracking-wider mb-2">
                {getPlanDetails()}
              </span>
              <h2 className="text-2xl font-black text-dark tracking-tight">Woohoo! Welcome Aboard</h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{message}</p>
            </div>

            <div className="pt-2 w-full">
              <button 
                onClick={() => navigate('/settings?tab=billing')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-primary hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-green-200/50"
              >
                Go to Billing Panel
                <ArrowRight size={16} />
              </button>
              <p className="text-xs text-gray-400 mt-4 animate-pulse">Automatically redirecting you in a moment...</p>
            </div>
          </div>
        )}

        {/* ── ERROR STATE ──────────────────────── */}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-5">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center relative animate-shake">
              <XCircle size={44} className="text-red-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-dark tracking-tight">Activation Blocked</h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{message}</p>
            </div>

            <div className="pt-2 w-full space-y-3">
              <button 
                onClick={() => {
                  setStatus('verifying');
                  setMessage('Retrying subscription verification...');
                  verifySubscription();
                }}
                className="w-full py-3.5 px-6 bg-dark hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-200"
              >
                Retry Verification
              </button>
              <button 
                onClick={() => navigate('/settings?tab=billing')}
                className="w-full py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors text-sm"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BillingCallback;
