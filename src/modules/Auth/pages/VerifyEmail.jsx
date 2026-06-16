import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, ShieldCheck, Mail, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode } = useAuth();
  const { addToast } = useToast();

  const initialEmail = location.state?.email || '';
  const [emailAddress, setEmailAddress] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const char = val.slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    setCode(newCode);
    inputRefs.current[5].focus();
  };

  const handleResend = async () => {
    if (!canResend) return;
    if (!emailAddress) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setResendLoading(true);
    try {
      await resendVerificationCode(emailAddress);
      addToast('Verification code resent successfully!', 'success');
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
      addToast(err.message || 'Failed to resend verification code', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailAddress) {
      setError('Please provide an email address.');
      return;
    }

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(emailAddress, fullCode);
      setSuccess(true);
      addToast('Email verified successfully! You can now log in.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code or try again.');
      addToast(err.message || 'Verification failed.', 'error');
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
              Verify your identity.
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              To secure your business profile and deploy your 24/7 AI employee, we need to confirm your email. Enter the 6-digit code sent to your inbox.
            </p>
          </div>

          {/* Feature list (3 items) */}
          <div className="space-y-4">
            {[
              { title: "Secure Account Access", desc: "Verifying prevents unauthorized access to your billing and customers." },
              { title: "Spam Prevention", desc: "Helps ensure our services remain safe and clear of malicious bots." },
              { title: "Fast Activation", desc: "Verification code is immediate and takes less than a minute to complete." }
            ].map((prop, i) => (
              <div key={i} className="flex gap-3.5 items-start">
                <div className="w-5 h-5 rounded-full bg-[#D4F263]/10 text-[#D4F263] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{prop.title}</h4>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="text-white/30 text-xs relative z-10">
          © {new Date().getFullYear()} Kasi AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-16 lg:px-20 xl:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-[400px] space-y-8">
          
          {/* Back button */}
          <div className="absolute top-8 right-6 sm:right-16 lg:right-20 xl:right-24">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-[#667085] hover:text-[#101828] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>

          {success ? (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1A7A4A]">
                <Check size={28} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#101828]">Email verified!</h2>
                <p className="text-[#667085] text-sm leading-relaxed">
                  Your email address has been successfully verified. Redirecting you to login...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1A7A4A]">
                  <ShieldCheck size={28} />
                </div>
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center gap-2 mb-6">
                  <img src="/kasi.png" alt="Kasi" className="w-8 h-8 object-contain shrink-0 select-none" />
                  <span className="font-sans text-xl font-bold tracking-tight text-[#101828]">
                    Kasi<span className="text-[#1A7A4A]">AI</span>
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#101828]">Enter verification code</h2>
                  <p className="text-[#667085] text-sm leading-relaxed">
                    We sent a 6-digit verification code to your email.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Section */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-[#344054]">EMAIL ADDRESS</label>
                    {!initialEmail && (
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                        className="text-xs font-medium text-[#1A7A4A] hover:underline"
                      >
                        {isEditingEmail ? "Save" : "Change"}
                      </button>
                    )}
                  </div>
                  {isEditingEmail ? (
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full h-11 pl-[42px] border border-[#D0D5DD] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-[#344054] font-medium flex items-center justify-between">
                      <span>{emailAddress}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(true)}
                        className="text-xs text-[#1A7A4A] font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* 6-Digit OTP inputs */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#344054]">6-DIGIT VERIFICATION CODE</label>
                  <div className="flex justify-between gap-2">
                    {code.map((num, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        maxLength="1"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        required
                        className="w-12 h-12 border border-[#D0D5DD] rounded-lg text-center text-lg font-bold text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                        value={num}
                        onChange={(e) => handleOtpChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onPaste={idx === 0 ? handlePaste : undefined}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#667085]">
                    Code is valid for 10 minutes.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading || code.join('').length < 6}
                    className="flex items-center justify-center w-full h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] focus:outline-none focus:ring-4 focus:ring-[#1A7A4A]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Verify Email'
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      disabled={!canResend || resendLoading}
                      onClick={handleResend}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A7A4A] hover:text-[#0F5533] disabled:text-[#98A2B3] disabled:cursor-not-allowed transition-colors"
                    >
                      {resendLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                      <span>
                        {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default VerifyEmail;
