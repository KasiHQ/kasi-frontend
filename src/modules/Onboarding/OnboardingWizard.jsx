import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, ArrowRight, ArrowLeft, ShoppingBag, 
  Briefcase, Phone, Instagram as InstagramIcon, 
  Building, MapPin, Loader2, Send
} from 'lucide-react';
import { onboardingAPI } from '../../api/onboarding';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { fetchUser, user } = useAuth();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(user?.business_type ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.business_type && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [user?.business_type, currentStep]);

  const steps = [
    {
      id: 'business_type',
      title: 'Business Type',
      description: 'What kind of business do you run?',
    },
    {
      id: 'profile',
      title: 'Business Profile',
      description: 'Tell us about your business',
    }
  ];


  const handleBusinessType = async (type) => {
    setLoading(true);
    try {
      await onboardingAPI.updateProfile({ business_type: type });
      await fetchUser();
      setCurrentStep(1);
    } catch (error) {
      setError('Failed to set business type');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async () => {
    setLoading(true);
    try {
      await onboardingAPI.complete();
      await fetchUser();
      addToast('Onboarding completed! Welcome to Kasi.', 'success');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'business_type':
        return <BusinessTypeStep onSelect={handleBusinessType} selected={user?.business_type} loading={loading} />;
      case 'profile':
        return <ProfileStep onComplete={handleProfileComplete} initialData={user} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-dark mb-2 tracking-tight">Kasi Setup</h1>
          <p className="text-gray-500 font-medium">Let's get your AI business agent ready.</p>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
            {renderStepContent()}
          </div>

          {/* Footer Progress */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-green-600' : 'w-4 bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── STEP: BUSINESS TYPE ─────────────────────────────────────────────────── */

const BusinessTypeStep = ({ onSelect, selected, loading }) => {
  const types = [
    { id: 'product', title: 'Product Seller', desc: 'I sell physical or digital goods', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'service', title: 'Service Provider', desc: 'I offer appointments and sessions', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-dark">How do you sell?</h2>
        <p className="text-gray-500 font-medium">This helps Kasi understand your workflow.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {types.map((t) => (
          <button
            key={t.id}
            disabled={loading}
            onClick={() => onSelect(t.id)}
            className={`group flex items-center gap-5 p-6 rounded-2xl border-2 transition-all text-left hover:border-green-600 hover:bg-green-50/30 ${
              selected === t.id ? 'border-green-600 bg-green-50 shadow-lg ring-4 ring-green-50' : 'border-gray-100 bg-white'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${t.bg} ${t.color}`}>
              <t.icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-dark text-lg">{t.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{t.desc}</p>
            </div>
            <ArrowRight size={20} className={selected === t.id ? 'text-green-600' : 'text-gray-300'} />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── STEP: BUSINESS PROFILE ──────────────────────────────────────────────── */

const ProfileStep = ({ onComplete, initialData, loading }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    business_name: initialData?.business_name || '',
    business_bio: initialData?.business_bio || '',
    instagram_handle: initialData?.instagram_handle || '',
    address: initialData?.address || '',
    phone: initialData?.phone || ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(initialData?.phone_verified || false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleUpdateField = async (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendCode = async () => {
    if (!form.phone) {
      addToast('Please enter your WhatsApp number first', 'error');
      return;
    }
    setSendingCode(true);
    try {
      await onboardingAPI.sendVerification(form.phone);
      setCodeSent(true);
      addToast('Verification code sent to your WhatsApp!', 'success');
    } catch (err) {
      addToast('Failed to send code. Please try again.', 'error');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    setVerifying(true);
    try {
      await onboardingAPI.verifyCode(verificationCode);
      setIsVerified(true);
      addToast('Phone number verified!', 'success');
    } catch (err) {
      addToast('Invalid verification code', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    // Save profile details first
    try {
      await onboardingAPI.updateProfile(form);
      onComplete();
    } catch (err) {
      addToast('Failed to save profile', 'error');
    }
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-dark">Business Profile</h2>
        <p className="text-gray-500 font-medium">Basic info so customers can find and trust you.</p>
      </div>

      <div className="space-y-5">
        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Name</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              value={form.business_name}
              onChange={(e) => handleUpdateField('business_name', e.target.value)}
              placeholder="e.g. Afro Chic Boutique"
            />
          </div>
        </div>

        {/* WhatsApp Number (No Verification) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">WhatsApp Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 transition-all outline-none"
              value={form.phone}
              onChange={(e) => handleUpdateField('phone', e.target.value)}
              placeholder="+234 812 345 6789"
            />
          </div>
        </div>

        {/* Business Bio */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Description</label>
          <textarea
            required
            rows={3}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 transition-all outline-none resize-none"
            value={form.business_bio}
            onChange={(e) => handleUpdateField('business_bio', e.target.value)}
            placeholder="What do you sell? Describe your unique style and what customers should know..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 transition-all outline-none"
                value={form.address}
                onChange={(e) => handleUpdateField('address', e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instagram Handle</label>
            <div className="relative">
              <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 transition-all outline-none"
                value={form.instagram_handle}
                onChange={(e) => handleUpdateField('instagram_handle', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-green-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-green-100 hover:bg-green-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 mt-6 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={20} className="animate-spin" /> Finalizing...</> : 'Complete Setup'}
      </button>
    </form>
  );
};

export default OnboardingWizard;