import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, ArrowRight, ArrowLeft, ShoppingBag, 
  Briefcase, Phone, Instagram as InstagramIcon, 
  Building, MapPin, Loader2, Send, UploadCloud,
  MessageSquare, DollarSign, Wallet, ShieldCheck,
  CheckCircle, Landmark, Copy, Truck
} from 'lucide-react';
import { onboardingAPI } from '../../api/onboarding';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const CITY_AREAS = {
  'Lagos': ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba", "Ajah", "Gbagada", "Maryland", "Ikoyi", "Apapa", "Ogba", "Agege"],
  'Abuja': ["Wuse", "Garki", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Apo", "Lugbe"],
  'Port Harcourt': ["GRA Phase 1-3", "Choba", "Diobu", "Trans Amadi", "Rumuokwuta", "Rumuola", "Rumuigbo", "Ada George"],
  'Ibadan': ["Bodija", "Akobo", "Samonda", "Apata", "Challenge", "Ring Road", "Oluyole", "UI / Agbowo"]
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { fetchUser, user } = useAuth();
  const { addToast } = useToast();
  
  // Steps: 1 = Profile, 2 = Store details, 3 = First Product/Service, 4 = Channels, 5 = Payment, 6 = Launch Screen
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [businessType, setBusinessType] = useState(user?.business_type || 'product');
  
  // Step 2 Store Details
  const [storeName, setStoreName] = useState(user?.business_name || '');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeDesc, setStoreDesc] = useState(user?.business_bio || '');
  const [storeLocation, setStoreLocation] = useState(user?.address || '');

  // Step 2 Logistics / Delivery Rate Sheet Details
  const [deliveryCity, setDeliveryCity] = useState(user?.delivery_city || '');
  const [deliveryRates, setDeliveryRates] = useState({});
  const [customAreaName, setCustomAreaName] = useState('');

  const handleCityChange = (city) => {
    setDeliveryCity(city);
    const areas = CITY_AREAS[city] || [];
    const newRates = { ...deliveryRates };
    areas.forEach(area => {
      if (newRates[area] === undefined) {
        newRates[area] = '';
      }
    });
    setDeliveryRates(newRates);
  };

  const handleAddCustomArea = (e) => {
    e.preventDefault();
    if (!customAreaName.trim()) return;
    const name = customAreaName.trim();
    if (deliveryRates[name] !== undefined) {
      addToast('Area already exists', 'info');
      return;
    }
    setDeliveryRates(prev => ({
      ...prev,
      [name]: ''
    }));
    setCustomAreaName('');
  };

  // Step 3 First Item
  const [itemName, setItemName] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [happyPrice, setHappyPrice] = useState('');
  const [lastPrice, setLastPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [itemImageName, setItemImageName] = useState('');

  // Step 4 Channels
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connectingWA, setConnectingWA] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isWhatsappConnected, setIsWhatsappConnected] = useState(false);
  const [activeChannelTab, setActiveChannelTab] = useState('whatsapp'); // whatsapp, telegram, instagram, messenger

  // Step 5 Payments
  const [paymentOption, setPaymentOption] = useState('bank'); // 'paystack' or 'bank'
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [banksList, setBanksList] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      if (user.business_type) {
        setBusinessType(user.business_type);
        setCurrentStep(2);
      }
      if (user.business_name) {
        setStoreName(user.business_name);
      }
      if (user.business_bio) {
        setStoreDesc(user.business_bio);
      }
      if (user.address) {
        setStoreLocation(user.address);
      }
      if (user.phone) {
        setWhatsappPhone(user.phone);
      }
      if (user.delivery_city) {
        setDeliveryCity(user.delivery_city);
      }
      if (user.delivery_rates) {
        let rates = {};
        if (typeof user.delivery_rates === 'object') {
          rates = user.delivery_rates;
        } else {
          try {
            rates = JSON.parse(user.delivery_rates);
          } catch (e) {
            console.error(e);
          }
        }
        setDeliveryRates(rates);
      }
      setInitialized(true);
    }
  }, [user, initialized]);

  const handleRoleSelect = (type) => {
    setBusinessType(type);
  };

  // Poll WhatsApp connection status when on step 4
  useEffect(() => {
    if (currentStep !== 4 || isWhatsappConnected) return;

    const fetchStatus = async () => {
      try {
        const res = await api.get('/api/whatsapp/status');
        if (res.data.connected) {
          setIsWhatsappConnected(true);
          setPairingCode('');
          addToast('WhatsApp connected successfully!', 'success');
        }
      } catch (err) {
        console.error('Failed to fetch WhatsApp status:', err);
      }
    };

    fetchStatus(); // initial check

    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [currentStep, isWhatsappConnected]);

  // Load Nigeria Banks list for Step 5
  useEffect(() => {
    if (currentStep === 5 && banksList.length === 0) {
      const fetchBanks = async () => {
        setBankLoading(true);
        try {
          const res = await api.get('/api/billing/banks');
          if (res.data && res.data.data) {
            setBanksList(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load banks:', err);
          addToast('Could not load bank list. Please check your internet connection.', 'error');
        } finally {
          setBankLoading(false);
        }
      };
      fetchBanks();
    }
  }, [currentStep, banksList.length]);

  const leftPanelHeadlines = {
    1: "Choose your path to commerce autonomy.",
    2: "Give your AI employee its credentials.",
    3: "Define your pricing guidelines.",
    4: "Open your business doors to the world.",
    5: "Ensure you get paid instantly."
  };

  const categories = [
    "Electronics", "Fashion & Clothing", "Food & Groceries", "Beauty & Cosmetics",
    "Health & Wellness", "Home & Furniture", "Services", "Other"
  ];

  const banks = [
    "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank", 
    "First Bank of Nigeria", "First City Monument Bank (FCMB)", "Guaranty Trust Bank (GTBank)",
    "Keystone Bank", "Polaris Bank", "Providus Bank", "Stanbic IBTC Bank", 
    "Standard Chartered", "Sterling Bank", "Union Bank of Nigeria", "United Bank for Africa (UBA)", 
    "Unity Bank", "Wema Bank", "Zenith Bank"
  ];

  const handleNext = async () => {
    setError('');
    
    // Save data per step
    if (currentStep === 1) {
      if (!businessType) {
        setError('Please select a seller profile.');
        return;
      }
      setLoading(true);
      try {
        await onboardingAPI.updateProfile({ business_type: businessType });
        await fetchUser();
        setCurrentStep(2);
      } catch (err) {
        setError('Failed to update seller profile. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      if (!storeName.trim()) {
        setError('Store Name is required.');
        return;
      }
      if (!deliveryCity) {
        setError('Base City for delivery is required.');
        return;
      }
      setLoading(true);
      try {
        const cleanedRates = {};
        Object.keys(deliveryRates).forEach(area => {
          const val = deliveryRates[area];
          if (val !== '' && val !== null && val !== undefined) {
            cleanedRates[area] = Number(val);
          }
        });

        await onboardingAPI.updateProfile({
          business_name: storeName,
          business_bio: storeDesc,
          address: storeLocation,
          store_category: storeCategory,
          delivery_city: deliveryCity,
          delivery_rates: cleanedRates
        });
        await fetchUser();
        setCurrentStep(3);
      } catch (err) {
        setError('Failed to save store details. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 3) {
      if (!itemName.trim() || !startingPrice) {
        setError('Item details are required unless skipped.');
        return;
      }
      setLoading(true);
      try {
        // Post first item to backend or save in store profile
        await onboardingAPI.updateProfile({
          first_item_name: itemName,
          first_item_starting_price: Number(startingPrice),
          first_item_happy_price: happyPrice ? Number(happyPrice) : undefined,
          first_item_last_price: lastPrice ? Number(lastPrice) : undefined
        });
        setCurrentStep(4);
      } catch (err) {
        setError('Failed to save item details.');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 4) {
      // Channels step: we proceed
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (!isBankVerified || !accountNumber || !bankCode) {
        setError('Please verify your bank account details before continuing.');
        return;
      }
      setLoading(true);
      try {
        await onboardingAPI.connectPaystack({
          bank_code: bankCode,
          account_number: accountNumber,
          bank_name: bankName
        });
        setCurrentStep(6); // Launch Screen!
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to connect settlement account. Please verify details and try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size should not exceed 5MB', 'error');
        return;
      }
      setItemImage(file);
      setItemImageName(file.name);
      addToast('Image uploaded successfully!', 'success');
    }
  };

  const handleConnectWhatsAppPairing = async () => {
    if (!whatsappPhone.trim()) {
      addToast('Please enter your WhatsApp phone number.', 'error');
      return;
    }
    const cleanNumber = whatsappPhone.replace(/\D/g, '');
    setConnectingWA(true);
    setPairingCode('');
    try {
      const res = await api.post('/api/whatsapp/connect', { phone_number: cleanNumber });
      if (res.data.pairing_code) {
        setPairingCode(res.data.pairing_code);
        addToast('Pairing code generated!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to generate code', 'error');
    } finally {
      setConnectingWA(false);
    }
  };

  const copyPairingCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCodeCopied(true);
    addToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const formatCode = (code) => {
    if (!code) return ['', ''];
    const clean = code.replace(/[-\s]/g, '');
    return [clean.slice(0, 4), clean.slice(4, 8)];
  };

  const [codeA, codeB] = formatCode(pairingCode);

  const verifyBankAccount = async () => {
    if (accountNumber.length !== 10) {
      addToast('Nigerian bank account numbers must be 10 digits.', 'error');
      return;
    }
    if (!bankCode) {
      addToast('Please select a bank first.', 'error');
      return;
    }
    setVerifyingAccount(true);
    setIsBankVerified(false);
    setAccountName('');
    try {
      const res = await api.post('/api/billing/resolve-bank', {
        account_number: accountNumber,
        bank_code: bankCode
      });
      if (res.data && res.data.data) {
        setAccountName(res.data.data.account_name);
        setIsBankVerified(true);
        addToast('Bank account successfully verified!', 'success');
      } else {
        addToast('Account verification failed. Please check account details.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Account verification failed.', 'error');
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await onboardingAPI.complete();
      await fetchUser();
      addToast('Onboarding completed! Welcome to Kasi.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      addToast('Failed to complete onboarding. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render launch page (Post Onboarding)
  if (currentStep === 6) {
    return (
      <div 
        className="min-h-screen text-white flex flex-col items-center justify-center p-6 select-none"
        style={{ backgroundColor: '#0F1F0F', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}
      >
        <div className="max-w-[540px] w-full text-center space-y-10 animate-in fade-in duration-1000">
          
          {/* Animated pulsing brand logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative animate-pulse">
              <img src="/kasi.png" alt="Kasi" className="w-12 h-12 object-contain select-none" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Your commerce agent is live.
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Kasi is now ready to handle your DMs, negotiate prices, and collect payments — 24/7.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <span className="inline-flex items-center gap-2 bg-[#12B76A]/15 border border-[#12B76A]/30 text-[#12B76A] px-5 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-ping" />
              Kasi is running
            </span>
          </div>

          <div className="pt-6">
            <button
              onClick={handleLaunch}
              disabled={loading}
              className="w-full max-w-[320px] h-12 bg-white text-[#0F1F0F] rounded-lg text-sm font-bold hover:bg-[#F0F0F0] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {loading && <Loader2 size={16} className="animate-spin text-[#0F1F0F]" />}
              <span>Go to your dashboard →</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex selection:bg-emerald-500/10 selection:text-primary kasi-app">
      
      {/* LEFT PANEL: Deep Dark Green, fixed, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-[#0F1F0F] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-white font-sans text-xl font-bold tracking-tight">
            <img src="/kasi.png" alt="Kasi" className="w-8 h-8 object-contain shrink-0 select-none" />
            <span className="font-bold text-lg">Kasi</span>
            <span className="text-[#D4F263] font-bold text-lg">AI</span>
          </div>
        </div>

        {/* Middle: Headline (changes per step) */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight transition-all duration-300">
              {leftPanelHeadlines[currentStep]}
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              Deploy your 24/7 AI employee. Automate catalog orders, negotiate within safe floor limits, and reconcile bank payments seamlessly.
            </p>
          </div>

          {/* Feature list */}
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

      {/* RIGHT PANEL: Wizard Steps */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-between min-h-screen relative p-0">
        
        {/* Top bar with progress indicator */}
        <div className="flex flex-col w-full sticky top-0 bg-white z-20">
          <div className="flex justify-between items-center w-full px-10 py-5">
            {currentStep > 1 ? (
              <button 
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#667085] hover:text-[#101828] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <div className="w-10" />
            )}
            <span className="text-[12px] font-semibold tracking-wider text-[#98A2B3] uppercase">
              STEP {currentStep} OF 5
            </span>
          </div>

          {/* Thin Progress bar */}
          <div className="h-[3px] bg-[#EAECF0] w-full relative">
            <div 
              className="h-full bg-[#1A7A4A] transition-all duration-500 ease-out"
              style={{ width: `${currentStep * 20}%` }}
            />
          </div>
        </div>

        {/* Step Content Wrapper */}
        <div className="flex-1 flex items-center justify-center px-10 py-8">
          <div className="w-full max-w-[480px] space-y-8">
            
            {/* Step error logs */}
            {error && (
              <div className="p-4 bg-[#FEF3F2] text-[#F04438] rounded-lg text-xs font-semibold border border-[#FEF3F2] text-center">
                {error}
              </div>
            )}

            {/* STEP 1: SELECT SELLER PROFILE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    Select your seller profile
                  </h2>
                  <p className="text-[#667085] text-sm">
                    Choose the option that aligns closest with your operational structure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
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
              </div>
            )}

            {/* STEP 2: STORE DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    Set up your store
                  </h2>
                  <p className="text-[#667085] text-sm">
                    This is what Kasi will introduce itself as to your customers.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Store Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">STORE NAME *</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. AFH Electronics"
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                    />
                    <p className="text-[11px] text-[#667085]">
                      This is the name Kasi will use when greeting customers.
                    </p>
                  </div>

                  {/* Store Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">STORE CATEGORY</label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none bg-white transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Describe your store */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">DESCRIBE YOUR STORE TO KASI</label>
                    <textarea
                      value={storeDesc}
                      onChange={(e) => setStoreDesc(e.target.value)}
                      placeholder="e.g. We sell premium Nigerian electronics. We are known for fast delivery and genuine products only."
                      rows={3}
                      className="w-full p-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none resize-y transition-all"
                    />
                    <p className="text-[11px] text-[#667085]">
                      Kasi uses this to describe your store and handle customer questions.
                    </p>
                  </div>

                  {/* Store Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">PHYSICAL LOCATION (OPTIONAL)</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        value={storeLocation}
                        onChange={(e) => setStoreLocation(e.target.value)}
                        placeholder="e.g. Computer Village, Ikeja, Lagos"
                        className="w-full h-11 pl-[42px] pr-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Delivery City Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-[#344054] flex items-center gap-1.5">
                      <Truck size={14} className="text-[#1A7A4A]" />
                      BASE CITY FOR DELIVERY *
                    </label>
                    <select
                      value={deliveryCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none bg-white transition-all font-semibold"
                    >
                      <option value="">Select your base city...</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Ibadan">Ibadan</option>
                    </select>
                    <p className="text-[11px] text-[#667085]">
                      Select the city where you dispatch your items from.
                    </p>
                  </div>

                  {/* Delivery Rates Grid */}
                  {deliveryCity && (
                    <div className="space-y-4 pt-3 border-t border-gray-100 animate-in fade-in duration-200">
                      <label className="block text-xs font-bold text-[#344054] uppercase tracking-wider">
                        Delivery Rates for {deliveryCity} Areas/LGAs
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                        {Object.keys(deliveryRates).map(area => (
                          <div key={area} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200/60 gap-2">
                            <span className="text-xs font-semibold text-gray-700 truncate">{area}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="relative rounded-lg shadow-xs w-24">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                  <span className="text-gray-400 text-[10px]">₦</span>
                                </div>
                                <input
                                  type="number"
                                  value={deliveryRates[area]}
                                  onChange={(e) => {
                                    setDeliveryRates(prev => ({
                                      ...prev,
                                      [area]: e.target.value
                                    }));
                                  }}
                                  placeholder="Price"
                                  className="w-full pl-5 pr-1.5 py-1 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A7A4A] transition-all font-semibold"
                                  min="0"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...deliveryRates };
                                  delete updated[area];
                                  setDeliveryRates(updated);
                                }}
                                className="text-gray-400 hover:text-red-500 font-bold text-xs p-1"
                                title="Remove Area"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Custom Area Input */}
                      <div className="flex gap-2 items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200/60">
                        <input
                          type="text"
                          value={customAreaName}
                          onChange={(e) => setCustomAreaName(e.target.value)}
                          placeholder="Add custom area (e.g. Ikotun)"
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#1A7A4A] font-semibold bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomArea}
                          disabled={!customAreaName.trim()}
                          className="px-3 py-1.5 bg-[#1A7A4A] hover:bg-[#0F5533] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-semibold rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: ADD FIRST PRODUCT / SERVICE */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    {businessType === 'product' ? 'Add your first product' : 'Add your first service'}
                  </h2>
                  <p className="text-[#667085] text-sm">
                    You can add more later. Let's start with one to get Kasi running.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Item Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">
                      {businessType === 'product' ? 'PRODUCT NAME *' : 'SERVICE NAME *'}
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder={businessType === 'product' ? 'e.g. Samsung Galaxy A55' : 'e.g. Hair Braiding Session'}
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                    />
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#344054]">STARTING PRICE (₦) *</label>
                      <input
                        type="number"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        placeholder="150,000"
                        className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#344054]">HAPPY PRICE (₦)</label>
                      <input
                        type="number"
                        value={happyPrice}
                        onChange={(e) => setHappyPrice(e.target.value)}
                        placeholder="130,000"
                        className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#344054]">LAST PRICE (₦)</label>
                      <input
                        type="number"
                        value={lastPrice}
                        onChange={(e) => setLastPrice(e.target.value)}
                        placeholder="110,000"
                        className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#98A2B3] italic leading-normal">
                    Starting = AI opening · Happy = your target · Last = floor the AI almost never reaches
                  </p>

                  {/* Upload Image */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#344054]">IMAGE</label>
                    <div className="border-2 border-dashed border-[#D0D5DD] hover:border-[#1A7A4A] hover:bg-[#F9FAFB] rounded-xl p-6 text-center cursor-pointer transition-all relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <div className="flex flex-col items-center gap-2">
                        <UploadCloud size={28} className="text-[#98A2B3]" />
                        <p className="text-sm font-semibold text-[#344054]">
                          {itemImageName ? itemImageName : 'Click or drag image here'}
                        </p>
                        <p className="text-xs text-[#98A2B3]">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs font-semibold text-[#667085] hover:underline"
                  >
                    Skip for now, I'll add products later →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONNECT CHANNELS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    Connect your first sales channel
                  </h2>
                  <p className="text-[#667085] text-sm">
                    Connect at least one channel so Kasi can start receiving and responding to customer messages.
                  </p>
                </div>

                {/* Channel selection wrapper */}
                <div className="space-y-4 pt-2">
                  {/* WhatsApp expanded card */}
                  <div className="bg-white border border-[#EAECF0] rounded-xl overflow-hidden shadow-xs">
                    <div 
                      onClick={() => setActiveChannelTab(activeChannelTab === 'whatsapp' ? '' : 'whatsapp')}
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F9FAFB]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#101828]">WhatsApp Business</h4>
                          <p className="text-xs text-[#667085]">Link WhatsApp with pairing code</p>
                        </div>
                      </div>

                      <div>
                        {isWhatsappConnected ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#ECFDF3] text-[#027A48] px-2.5 py-1 rounded-full text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                            Connected
                          </span>
                        ) : (
                          <button type="button" className="text-xs font-semibold text-[#1A7A4A] hover:underline">
                            Configure
                          </button>
                        )}
                      </div>
                    </div>

                    {activeChannelTab === 'whatsapp' && !isWhatsappConnected && (
                      pairingCode ? (
                        <div className="p-5 border-t border-[#EAECF0] bg-[#F9FAFB] space-y-4 animate-in slide-in-from-top-2 duration-200 text-center">
                          <p className="text-xs text-gray-600">
                            Enter this pairing code in your phone's WhatsApp:
                            <br />
                            <span className="font-semibold text-gray-800">Settings &gt; Linked Devices &gt; Link with phone number</span>
                          </p>
                          
                          <div className="flex items-center justify-center gap-3">
                            <div className="bg-white border border-[#D0D5DD] rounded-xl px-4 py-3 text-2xl font-bold tracking-widest text-[#101828] shadow-sm">{codeA}</div>
                            <span className="text-gray-400 font-bold">—</span>
                            <div className="bg-white border border-[#D0D5DD] rounded-xl px-4 py-3 text-2xl font-bold tracking-widest text-[#101828] shadow-sm">{codeB}</div>
                          </div>

                          <div className="flex flex-col items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={copyPairingCode}
                              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#D0D5DD] bg-white text-[#344054] text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <Copy size={13} />
                              {codeCopied ? 'Copied!' : 'Copy Code'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => { setPairingCode(''); setWhatsappPhone(''); }}
                              className="text-xs text-[#667085] hover:text-[#101828] hover:underline"
                            >
                              Start over / Change phone number
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 text-xs text-[#1A7A4A] font-semibold bg-[#E8F5EE] py-2 px-3 rounded-lg border border-[#B0D9C1] w-fit mx-auto animate-pulse">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Waiting for connection...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border-t border-[#EAECF0] bg-[#F9FAFB] space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#344054]">WhatsApp Phone Number</label>
                            <input
                              type="tel"
                              value={whatsappPhone}
                              onChange={(e) => setWhatsappPhone(e.target.value)}
                              placeholder="e.g. 2348123456789"
                              className="w-full h-11 px-3.5 border border-[#D0D5DD] bg-white rounded-lg text-sm text-[#101828] outline-none focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 transition-all"
                            />
                            <p className="text-[11px] text-[#667085]">
                              Enter with country code (e.g. 234 for Nigeria) without the '+' prefix or leading 0.
                            </p>
                          </div>
                          
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={handleConnectWhatsAppPairing}
                              disabled={connectingWA || !whatsappPhone.trim()}
                              className="h-10 px-4 bg-[#1A7A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#0F5533] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {connectingWA && <Loader2 size={13} className="animate-spin" />}
                              <span>{connectingWA ? 'Generating...' : 'Get Code'}</span>
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Mock Channel Cards */}
                  {[
                    { id: 'telegram', name: 'Telegram', sub: 'Connect via Telegram Bot API', color: 'bg-[#26A5E4]/10 text-[#26A5E4]' },
                    { id: 'instagram', name: 'Instagram', sub: 'Direct DMs & Comments AI handler', color: 'bg-[#E4405F]/10 text-[#E4405F]' },
                    { id: 'messenger', name: 'Facebook Messenger', sub: 'Messenger catalog assistant', color: 'bg-[#0084FF]/10 text-[#0084FF]' },
                  ].map((ch) => (
                    <div 
                      key={ch.id}
                      className="flex items-center justify-between p-4 bg-white border border-[#EAECF0] rounded-xl hover:bg-[#F9FAFB]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${ch.color} flex items-center justify-center shrink-0`}>
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#101828]">{ch.name}</h4>
                          <p className="text-xs text-[#667085]">{ch.sub}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => addToast(`${ch.name} integration will be accessible from dashboard settings.`, 'info')}
                        className="text-xs font-semibold text-[#98A2B3] hover:text-[#101828]"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="text-xs font-semibold text-[#667085] hover:underline"
                  >
                    I'll connect channels later, set up Kasi first →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT SETUP */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-[#101828]">
                    Settlement Bank Account
                  </h2>
                  <p className="text-[#667085] text-sm">
                    Set up your payout destination. When customers purchase from your WhatsApp or AI agents, payments are split instantly. Your funds land directly in this bank account.
                  </p>
                </div>

                <div className="bg-[#ECFDF3] border border-[#B0D9C1] rounded-xl p-4 flex gap-3 text-xs text-[#027A48] select-none">
                  <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Direct & Safe Settlement:</span> Kasi facilitates immediate split payments via Paystack. ZERO funds are held in escrow. Payouts arrive instantly, minus the 2.0% platform fee.
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#344054]">SELECT BANK</label>
                    <select
                      value={bankCode}
                      onChange={(e) => {
                        setBankCode(e.target.value);
                        const selected = banksList.find(b => b.code === e.target.value);
                        setBankName(selected ? selected.name : '');
                        setIsBankVerified(false);
                        setAccountName('');
                      }}
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] bg-white rounded-lg text-sm text-[#101828] outline-none focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 transition-all bg-no-repeat"
                    >
                      <option value="">{bankLoading ? 'Loading Nigerian banks...' : 'Choose your bank...'}</option>
                      {banksList.map(b => (
                        <option key={b.code} value={b.code}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#344054]">ACCOUNT NUMBER (10 DIGITS)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value.replace(/\D/g, ''));
                        setIsBankVerified(false);
                        setAccountName('');
                      }}
                      placeholder="e.g. 0123456789"
                      className="w-full h-11 px-3.5 border border-[#D0D5DD] bg-white rounded-lg text-sm text-[#101828] outline-none focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 transition-all font-mono tracking-widest"
                    />
                  </div>

                  {accountName && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex justify-between items-center animate-in fade-in duration-300">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-[#667085] tracking-wider uppercase">RESOLVED ACCOUNT NAME</span>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle size={14} className="text-[#1A7A4A]" />
                          {accountName}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isBankVerified && (
                    <button
                      type="button"
                      onClick={verifyBankAccount}
                      disabled={verifyingAccount || accountNumber.length !== 10 || !bankCode}
                      className="w-full h-11 bg-white border border-[#D0D5DD] hover:bg-slate-50 text-[#344054] text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      {verifyingAccount ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-[#1A7A4A]" />
                          <span>Verifying with NIBSS...</span>
                        </>
                      ) : (
                        <>
                          <Landmark size={16} className="text-[#1A7A4A]" />
                          <span>Verify Bank Account</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="text-xs font-semibold text-[#667085] hover:underline"
                  >
                    I'll configure payments later from settings →
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 flex justify-between items-center gap-4">
              <div className="w-1" />
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-[180px] h-11 bg-[#1A7A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#0F5533] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                <span>{currentStep === 5 ? 'Finish Setup →' : 'Continue →'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default OnboardingWizard;