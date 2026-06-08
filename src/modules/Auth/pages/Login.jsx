import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.is_admin) {
        navigate('/kasisalienceadministration');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
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
            <img src="/kasi.png" alt="Kasi" className="w-8 h-8 object-contain shrink-0 select-none" />
            <span className="font-bold text-lg">Kasi</span>
            <span className="text-[#D4F263] font-bold text-lg">AI</span>
          </Link>
        </div>

        {/* Middle: Headline */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome back to your commerce agent panel.
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
            KASI AI
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Sign In Form */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-between min-h-screen p-10 relative">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-[440px] mx-auto mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#101828] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to website</span>
          </Link>
          <span className="text-[10px] font-semibold tracking-wider text-[#98A2B3] uppercase">
            SIGN IN
          </span>
        </div>

        {/* Form Panel wrapper */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[440px] space-y-8">
            
            {/* Error Alerts */}
            {error && (
              <div className="p-4 bg-[#FEF3F2] text-[#F04438] rounded-lg text-xs font-semibold border border-[#FEF3F2] text-center animate-in fade-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center gap-2 mb-6">
                  <img src="/kasi.png" alt="Kasi" className="w-8 h-8 object-contain shrink-0 select-none" />
                  <span className="font-sans text-xl font-bold tracking-tight text-[#101828]">
                    Kasi<span className="text-[#1A7A4A]">AI</span>
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                  Welcome back
                </h2>
                <p className="text-[#667085] text-sm">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Address Field */}
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

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-[#344054]">PASSWORD</label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-[#1A7A4A] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full h-11 pl-[42px] pr-11 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Footer secure row */}
        <div className="w-full max-w-[440px] mx-auto pt-6 border-t border-[#EAECF0] flex items-center justify-center text-[#98A2B3]">
          <p className="text-xs text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#1A7A4A] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;
