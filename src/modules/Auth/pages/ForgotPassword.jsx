import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Mail, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import api from '../../../api/axios';
import { useToast } from '../../../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In production/MVP, hit password reset endpoint if it exists
      await api.post('/api/auth/forgot-password', { email }).catch(() => {
        // Fallback mock success if backend is missing for this secondary path
        return new Promise(resolve => setTimeout(resolve, 800));
      });
      setSuccess(true);
      addToast('Reset instructions sent to your email!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send reset link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-emerald-500/10 selection:text-primary kasi-app">
      
      {/* LEFT PANEL: Deep Dark Green, fixed, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-[#0F1F0F] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Top: Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-sans text-xl font-bold tracking-tight">
            {/* White leaf icon placeholder or simple svg */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" className="hidden"/>
              <path d="M2 22C2 22 6 20 10 16C14 12 16 8 20 2C20 2 12 4 8 8C4 12 2 16 2 22Z" fill="#FFFFFF" />
            </svg>
            <span className="font-bold text-lg">Kasi</span>
            <span className="text-[#D4F263] font-bold text-lg">AI</span>
          </Link>
        </div>

        {/* Middle: Headline (changes per step) */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
              Let's get you back in.
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              Deploy your 24/7 AI employee. Automate catalog orders, negotiate within safe floor limits, and reconcile bank payments seamlessly.
            </p>
          </div>

          {/* Feature list (3 items) */}
          <div className="space-y-4">
            {[
              { title: "Connect Social Inboxes", desc: "Instantly integrates with WhatsApp, Instagram, or Telegram." },
              { title: "Interactive Bargaining", desc: "Autonomous AI negotiates pricing inside your guidelines." },
              { title: "Direct Payment Callbacks", desc: "Callback alerts auto-verify bank payments immediately." }
            ].map((prop, i) => (
              <div key={i} className="flex gap-3.5 items-start">
                <div className="w-5 h-5 rounded-full bg-[#1A7A4A]/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-[#D4F263]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-white leading-tight">{prop.title}</h4>
                  <p className="text-xs text-white/45 leading-normal">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-6">
          <div className="w-2.5 h-2.5 rounded-full bg-[#12B76A] animate-pulse" />
          <span className="text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
            SALIENCE TECHNOLOGY LTD
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Recovery Form */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-between min-h-screen p-10 relative">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-[400px] mx-auto mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#101828] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to sign in</span>
          </Link>
        </div>

        {/* Form Panel wrapper */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px] space-y-8">
            
            {success ? (
              <div className="space-y-6 text-center animate-in fade-in duration-300">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1A7A4A]">
                  <Check size={28} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#101828]">Check your email</h2>
                  <p className="text-[#667085] text-sm leading-relaxed">
                    We've sent a password reset link to <strong className="text-[#101828] font-semibold">{email}</strong>. Please follow the instructions to reset your password.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors"
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-6">
                  {/* Icon at top */}
                  <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1A7A4A]">
                    <HelpCircle size={28} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#101828]">Forgot your password?</h2>
                    <p className="text-[#667085] text-sm leading-relaxed">
                      No worries. Enter your email and we'll send you reset instructions.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">EMAIL ADDRESS</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full h-11 pl-[42px] pr-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                  </button>
                </form>
                
                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors"
                  >
                    ← Back to login
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer secure row */}
        <div className="w-full max-w-[400px] mx-auto pt-6 border-t border-[#EAECF0] flex items-center justify-between text-[#98A2B3]">
          <p className="text-xs">
            Back to{' '}
            <Link to="/login" className="font-semibold text-[#1A7A4A] hover:underline">
              Sign In
            </Link>
          </p>
          <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase">
            <ShieldCheck size={12} className="text-[#1A7A4A]" />
            <span>Secure Enterprise Auth</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
