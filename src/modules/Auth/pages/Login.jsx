import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.is_admin) {
        navigate('/admin');
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
    <div className="min-h-screen bg-white dark:bg-bg-main flex selection:bg-emerald-500/10 selection:text-primary">
      
      {/* LEFT COLUMN: Brand Emerald backing, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-gradient-to-br from-emerald-950 via-[#0F8C55] to-emerald-900 text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Abstract Background Design Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-bricolage text-2xl font-black tracking-tight group">
            <span>Kasi</span>
            <span className="text-green-300">AI</span>
          </Link>
        </div>

        {/* Brand Pitch Copy */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-semibold font-bricolage tracking-tight leading-tight">
              Welcome back to your commerce agent panel.
            </h1>
            <p className="text-green-100/70 text-sm leading-relaxed font-prompt font-medium">
              Deploy your 24/7 AI employee. Automate catalog orders, negotiate within safe floor limits, and reconcile bank payments seamlessly.
            </p>
          </div>

          {/* Core Value Props Checklist */}
          <div className="space-y-4 font-prompt">
            {[
              { title: "Connect Social Inboxes", desc: "Instantly integrates with WhatsApp, Instagram, or Telegram." },
              { title: "Interactive Bargaining", desc: "Autonomous AI negotiates pricing inside your guidelines." },
              { title: "Direct Payment Callbacks", desc: "Callback alerts auto-verify bank payments immediately." }
            ].map((prop, i) => (
              <div key={i} className="flex gap-3.5 items-start">
                <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-green-300" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white leading-tight">{prop.title}</h4>
                  <p className="text-[10px] text-green-100/50 leading-normal font-medium">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salience Tech Branding Watermark */}
        <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-black tracking-widest text-green-200/50 uppercase">
            SALIENCE TECHNOLOGY LTD
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign In Form */}
      <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col justify-between min-h-screen px-6 py-10 md:p-12 xl:p-16 relative">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center max-w-lg mx-auto w-full mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to website</span>
          </Link>
          <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
            Sign In
          </span>
        </div>

        {/* Form Panel wrapper */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg space-y-8">
            
            {/* Success/Error Alerts */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-500/20 text-center animate-in fade-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-semibold font-bricolage tracking-tight text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-prompt text-xs md:text-sm font-medium">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 font-prompt">
                
                {/* Email Address Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@usekasi.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                    {/* Placeholder for forgot password if needed in future */}
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Footer info column */}
        <div className="max-w-lg mx-auto w-full pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-prompt select-none">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-emerald-700 transition-colors">
              Create an account
            </Link>
          </p>
          <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-gray-400 uppercase">
            <ShieldCheck size={12} className="text-primary" />
            <span>Secure Enterprise Auth</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
