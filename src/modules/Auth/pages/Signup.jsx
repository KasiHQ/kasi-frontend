import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Mail, Lock, ShieldCheck, Eye, EyeOff, ShoppingBag, Briefcase } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';


const Signup = () => {
  const [step, setStep] = useState(1); // 1 = Seller Profile, 2 = Credential details
  const [businessType, setBusinessType] = useState(''); // 'product' or 'service'
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, login, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleGoogleSignup = async (response) => {
    const termsChecked = document.getElementById("terms")?.checked;
    const consentChecked = document.getElementById("consent")?.checked;
    
    if (!termsChecked || !consentChecked) {
      setError("Please agree to the Terms of Service and Data Consent before continuing.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(response.credential, businessType);
      addToast('Account created successfully!', 'success');
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Google Sign-Up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google && step === 2) {
      try {
        google.accounts.id.initialize({
          client_id: "418652112968-i6bv554036fq1p6stf6ujhsf5qkste3q.apps.googleusercontent.com",
          callback: handleGoogleSignup,
          auto_select: true,
        });

        // Trigger Google One Tap
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap not displayed signup:", notification.getNotDisplayedReason());
          }
        });

        // Render standard signup button
        google.accounts.id.renderButton(
          document.getElementById("google-signup-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: Math.min(400, Math.max(200, window.innerWidth - 80)),
            text: "signup_with",
            shape: "rectangular"
          }
        );
      } catch (err) {
        console.error("Google Client Init failed:", err);
      }
    }
  }, [step]);



  const handleRoleSelect = (type) => {
    setBusinessType(type);
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-[#F04438]', textClass: 'text-[#F04438]' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-[#F97316]', textClass: 'text-[#F97316]' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-[#F79009]', textClass: 'text-[#F79009]' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-[#12B76A]', textClass: 'text-[#12B76A]' };
    return { score: 1, label: 'Weak', color: 'bg-[#F04438]', textClass: 'text-[#F04438]' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessType) {
      setError('Please select a business profile first');
      setStep(1);
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    if (!agreeConsent) {
      setError('You must consent to allow Kasi to process data to help serve your customers better');
      return;
    }
    setError('');
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+234${phone.replace(/^0+/, '')}`;

    try {
      // 1. Signup user
      await signup(businessName, email, password, businessType);
      
      // 2. Automate login
      await login(email, password);
      
      addToast('Account created successfully!', 'success');
      
      // 3. Route to onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
              A few clicks away from launching your commerce agent.
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

      {/* RIGHT PANEL: Signup Wizard Form */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-between min-h-screen p-10 relative">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-[440px] mx-auto mb-8">
          {step === 2 ? (
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#101828] transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to profiles</span>
            </button>
          ) : (
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#101828] transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to website</span>
            </Link>
          )}
          <span className="text-[10px] font-semibold tracking-wider text-[#98A2B3] uppercase">
            {step === 1 ? 'STEP 1 OF 2' : 'STEP 2 OF 2'}
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

            {/* STEP 1: Select Seller Profile */}
            {step === 1 && (
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
                    Select your seller profile
                  </h2>
                  <p className="text-[#667085] text-sm">
                    Choose the option that aligns closest with your operational structure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Card 1: Product Seller */}
                  <div
                    onClick={() => handleRoleSelect('product')}
                    className={`flex flex-col justify-between p-7 rounded-2xl border cursor-pointer transition-all relative ${
                      businessType === 'product'
                        ? 'border-[#1A7A4A] bg-white shadow-[0_0_0_4px_rgba(26,122,74,0.1)]'
                        : 'border-[#EAECF0] bg-white shadow-sm hover:border-[#B0D9C1]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#E8F5EE] text-[#1A7A4A]`}>
                        <ShoppingBag size={22} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[#101828] text-base">Product Seller</h3>
                        <p className="text-xs text-[#667085] leading-relaxed">
                          I sell physical goods (clothing, beauty, gadgets) requiring inventory control, checkouts, and parcel delivery.
                        </p>
                      </div>
                    </div>
                    {businessType === 'product' && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#1A7A4A] flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Card 2: Service Provider */}
                  <div
                    onClick={() => handleRoleSelect('service')}
                    className={`flex flex-col justify-between p-7 rounded-2xl border cursor-pointer transition-all relative ${
                      businessType === 'service'
                        ? 'border-[#1A7A4A] bg-white shadow-[0_0_0_4px_rgba(26,122,74,0.1)]'
                        : 'border-[#EAECF0] bg-white shadow-sm hover:border-[#B0D9C1]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#E8F5EE] text-[#1A7A4A]`}>
                        <Briefcase size={22} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[#101828] text-base">Service Provider</h3>
                        <p className="text-xs text-[#667085] leading-relaxed">
                          I sell professional consultations, beauty services, gig bookings, scheduling, or customized agreements.
                        </p>
                      </div>
                    </div>
                    {businessType === 'service' && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#1A7A4A] flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!businessType}
                  className="w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors disabled:bg-[#B0D9C1] disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue Setup</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* STEP 2: Main Credential Input Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2 mb-2">
                  {/* Mobile Logo */}
                  <div className="lg:hidden flex items-center gap-2 mb-6">
                    <img src="/kasi.png" alt="Kasi" className="w-8 h-8 object-contain shrink-0 select-none" />
                    <span className="font-sans text-xl font-bold tracking-tight text-[#101828]">
                      Kasi<span className="text-[#1A7A4A]">AI</span>
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    Create your account
                  </h2>
                  <p className="text-[#667085] text-sm">
                    Start your 7-day free trial. No credit card required.
                  </p>
                </div>

                {/* Business Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#344054]">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Duro's Cosmetics"
                  />
                </div>

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
                      placeholder="name@usekasi.com"
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#344054]">PHONE NUMBER</label>
                  <div className="flex rounded-lg border border-[#D0D5DD] overflow-hidden focus-within:border-[#1A7A4A] focus-within:ring-4 focus-within:ring-[#1A7A4A]/12 transition-all">
                    <div className="flex items-center gap-1 bg-[#F9FAFB] border-r border-[#D0D5DD] px-3.5 py-2 text-sm text-[#344054] font-medium shrink-0">
                      <span>🇳🇬</span>
                      <span>+234</span>
                    </div>
                    <input
                      type="tel"
                      required
                      className="w-full h-11 px-3.5 text-sm text-[#101828] placeholder-[#98A2B3] outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="812 345 6789"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#344054]">PASSWORD</label>
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((num) => (
                          <div
                            key={num}
                            className={`flex-1 h-full rounded-[2px] transition-all duration-300 ${
                              strength.score >= num ? strength.color : 'bg-[#EAECF0]'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[11px] font-semibold ${strength.textClass}`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms and Privacy Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0D5DD] text-[#1A7A4A] focus:ring-[#1A7A4A] mt-0.5"
                  />
                  <label htmlFor="terms" className="text-xs text-[#344054] leading-normal select-none">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#1A7A4A] font-semibold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[#1A7A4A] font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={agreeConsent}
                    onChange={(e) => setAgreeConsent(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0D5DD] text-[#1A7A4A] focus:ring-[#1A7A4A] mt-0.5"
                  />
                  <label htmlFor="consent" className="text-xs text-[#344054] leading-normal select-none">
                    I allow Kasi to process my sales interactions and use my business data to help serve my customers better.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreeTerms || !agreeConsent}
                  className="w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#EAECF0]"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-[#EAECF0]"></div>
                </div>

                <div className="flex justify-center w-full min-h-[44px]">
                  <div id="google-signup-btn" className="w-full flex justify-center"></div>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Footer secure row */}
        <div className="w-full max-w-[440px] mx-auto pt-6 border-t border-[#EAECF0] flex items-center justify-center text-[#98A2B3]">
          <p className="text-xs text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#1A7A4A] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Signup;
