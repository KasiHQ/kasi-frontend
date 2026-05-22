import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme, THEMES } from '../../../context/ThemeContext';
import Button from '../../../components/ui/Button';
import api from '../../../api/axios';
import { Save, Building, Phone, MapPin, CreditCard, Image as ImageIcon, Palette, User, Check, Brain, History, Wifi, WifiOff, MessageCircle, Instagram, Calendar, Zap, HelpCircle, FileText, ExternalLink, Send, Facebook, Layout, Wallet, ShieldCheck, Landmark, CheckCircle, AlertTriangle } from 'lucide-react';
import ActivityLogsTable from '../components/ActivityLogsTable';
import IntegrationsTab from '../components/IntegrationsTab';
import { X } from 'lucide-react';

/* ── Tab Button ───────────────────────────────────── */
const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap
            ${active
                ? 'bg-primary text-white shadow-md shadow-green-200 dark:shadow-none'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            }`}
    >
        <Icon size={18} className="shrink-0" />
        {label}
    </button>
);

/* ── Theme Card ───────────────────────────────────── */
const ThemeCard = ({ theme, isSelected, onSelect }) => (
    <button
        onClick={() => onSelect(theme.id)}
        className={`relative group rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.03]
            ${isSelected ? 'border-primary shadow-lg shadow-green-100 ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}
        style={{ width: '100%' }}
    >
        <div className="p-3" style={{ backgroundColor: theme.body }}>
            <div className="h-2 rounded-full mb-2" style={{ backgroundColor: theme.accent, width: '60%', opacity: 0.8 }} />
            <div className="rounded-lg p-2 mb-1.5" style={{ backgroundColor: theme.card }}>
                <div className="h-1.5 rounded-full mb-1" style={{ backgroundColor: theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', width: '80%' }} />
                <div className="h-1.5 rounded-full" style={{ backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', width: '50%' }} />
            </div>
            <div className="space-y-1">
                <div className="h-1 rounded-full" style={{ backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', width: '100%' }} />
                <div className="h-1 rounded-full" style={{ backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', width: '70%' }} />
            </div>
        </div>
        <div className={`px-3 py-2 text-center text-xs font-semibold border-t
            ${isSelected ? 'bg-green-50 text-green-700 border-green-100' : 'bg-white text-gray-600 border-gray-100'}`}>
            <span className="mr-1">{theme.emoji}</span>
            {theme.name}
        </div>
        {isSelected && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
            </div>
        )}
    </button>
);

/* ── Integration Platform Card ──────────────────── */
const PlatformCard = ({ icon: Icon, iconBg, name, description, connected, onConnect, onDisconnect, loading: cardLoading }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-b-0">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="font-semibold text-dark text-sm">{name}</p>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {connected ? (
                <>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected
                    </span>
                    <button
                        onClick={onDisconnect}
                        disabled={cardLoading}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={onConnect}
                    disabled={cardLoading}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    Connect
                </button>
            )}
        </div>
    </div>
);
/* ── Integration Modal ──────────────────────────── */
const PlatformModal = ({ isOpen, onClose, platform }) => {
    if (!isOpen || !platform) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-dark dark:text-white capitalize">{platform} Integration</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <IntegrationsTab standalone={false} focusedPlatform={platform} />
                </div>
            </div>
        </div>
    );
};
/* ── Main Settings Page ───────────────────────────── */
const Settings = () => {
    const { user, token, fetchUser } = useAuth();
    const { addToast } = useToast();
    const { theme: currentTheme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'integrations';
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Integration states
    const [waStatus, setWaStatus] = useState({ connected: false });
    const [igStatus, setIgStatus] = useState({ connected: false });
    const [paystackStatus, setPaystackStatus] = useState({ connected: false });
    const [loadingIntegrations, setLoadingIntegrations] = useState(true);

    // Subscription & Billing details states
    const [billingDetails, setBillingDetails] = useState(null);
    const [billingLoading, setBillingLoading] = useState(true);
    const [banksList, setBanksList] = useState([]);
    const [bankCode, setBankCode] = useState('');
    const [verifyingBank, setVerifyingBank] = useState(false);
    const [isBankVerified, setIsBankVerified] = useState(false);
    const [connectingSubaccount, setConnectingSubaccount] = useState(false);

    const [formData, setFormData] = useState({
        business_name: '',
        phone: '',
        address: '',
        logo_url: '',
        bank_name: '',
        account_number: '',
        account_name: '',
        ai_instructions: '',
        business_bio: '',
        instagram_handle: '',
        whatsapp_link: '',
        social_links: '',
        delivery_details: '',
        payment_details: '',
        opening_hours: '',
        business_type: '',
        agent_name: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                business_name: user.business_name || '',
                phone: user.phone || '',
                address: user.address || '',
                logo_url: user.logo_url || '',
                bank_name: user.bank_name || '',
                account_number: user.account_number || '',
                account_name: user.account_name || '',
                ai_instructions: user.ai_instructions || '',
                business_bio: user.business_bio || '',
                instagram_handle: user.instagram_handle || '',
                whatsapp_link: user.whatsapp_link || '',
                social_links: user.social_links || '',
                delivery_details: user.delivery_details || '',
                payment_details: user.payment_details || '',
                opening_hours: user.opening_hours || '',
                business_type: user.business_type || 'product',
                agent_name: user.agent_name || 'Kasi'
            });
        }
    }, [user]);

    useEffect(() => {
        fetchIntegrationStatuses();
        fetchBillingDetails();
    }, []);

    const fetchBillingDetails = async () => {
        setBillingLoading(true);
        try {
            const res = await api.get('/api/billing/subscription-details');
            if (res.data && res.data.data) {
                setBillingDetails(res.data.data);
                // Pre-verify bank if details exist in response
                if (res.data.data.account_number && res.data.data.bank_name) {
                    setIsBankVerified(true);
                }
            }
        } catch (err) {
            console.error('Failed to fetch billing details:', err);
        } finally {
            setBillingLoading(false);
        }
    };

    // Load Nigeria Banks list for Payment Settlement
    useEffect(() => {
        if (activeTab === 'payment' && banksList.length === 0) {
            const fetchBanks = async () => {
                try {
                    const res = await api.get('/api/billing/banks');
                    if (res.data && res.data.data) {
                        setBanksList(res.data.data);
                    }
                } catch (err) {
                    console.error('Failed to load banks:', err);
                }
            };
            fetchBanks();
        }
    }, [activeTab, banksList.length]);

    const handleInitializeSubscription = async (tier) => {
        setLoading(true);
        try {
            const res = await api.post('/api/billing/initialize-subscription', {
                tier,
                type: billingDetails?.subscription_type || formData.business_type || 'product',
                callback_url: window.location.origin + '/billing/callback'
            });
            if (res.data && res.data.authorization_url) {
                window.location.href = res.data.authorization_url;
            } else {
                addToast('Failed to initialize subscription checkout.', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.error || 'Failed to initialize subscription.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your active subscription? You will retain access until the end of your billing cycle.')) {
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/api/billing/cancel');
            if (res.data && res.data.status === 'success') {
                addToast('Subscription successfully cancelled.', 'success');
                fetchBillingDetails();
            }
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.error || 'Failed to cancel subscription.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchIntegrationStatuses = async () => {
        try {
            const res = await api.get('/api/whatsapp/status');
            setWaStatus({ connected: res.data.connected });
            // Check for Instagram integration
            const integrations = res.data.integrations || [];
            const igInt = integrations.find(i => i.platform === 'instagram');
            setIgStatus({ connected: igInt?.connection_status === 'connected' });
        } catch {
            // silent
        } finally {
            setLoadingIntegrations(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch('/api/auth/profile', formData);
            if (fetchUser) await fetchUser();
            addToast('Settings updated successfully', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
            addToast('Failed to update settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-dark mb-1">Settings</h1>
                <p className="text-gray-500 text-sm">Manage integrations, AI persona, and account details.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-gray-800/50 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <TabButton active={activeTab === 'integrations'} icon={Zap} label="Integrations" onClick={() => setActiveTab('integrations')} />
                <TabButton active={activeTab === 'general'} icon={Building} label="General" onClick={() => setActiveTab('general')} />
                <TabButton active={activeTab === 'payment'} icon={Wallet} label="Settlement & Payouts" onClick={() => setActiveTab('payment')} />
                <TabButton active={activeTab === 'billing'} icon={CreditCard} label="Billing & Subscriptions" onClick={() => setActiveTab('billing')} />
                <TabButton active={activeTab === 'ai_rules'} icon={Brain} label="AI Rules" onClick={() => setActiveTab('ai_rules')} />
                {/* <TabButton active={activeTab === 'appearance'} icon={Palette} label="Appearance" onClick={() => setActiveTab('appearance')} /> */}
                <TabButton active={activeTab === 'activity'} icon={History} label="Activity" onClick={() => setActiveTab('activity')} />
            </div>

            {/* Platform Modal */}
            <PlatformModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={selectedPlatform}
            />

            {/* ── INTEGRATIONS TAB ─────────────────────── */}
            {activeTab === 'integrations' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <IntegrationsTab />
                </div>
            )}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Connected Platforms */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-dark mb-4">Connected platforms</h2>
                            <div>
                                <PlatformCard
                                    icon={MessageCircle}
                                    iconBg="bg-green-500"
                                    name="WhatsApp Business"
                                    description="Handle customer DMs on WhatsApp"
                                    connected={waStatus.connected}
                                    onConnect={() => { setSelectedPlatform('whatsapp'); setIsModalOpen(true); }}
                                    onDisconnect={() => { setSelectedPlatform('whatsapp'); setIsModalOpen(true); }}
                                    loading={loadingIntegrations}
                                />
                                <PlatformCard
                                    icon={Instagram}
                                    iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
                                    name="Instagram"
                                    description="Respond to DMs from Instagram posts"
                                    connected={igStatus.connected}
                                    onConnect={() => { setSelectedPlatform('instagram'); setIsModalOpen(true); }}
                                    onDisconnect={() => { setSelectedPlatform('instagram'); setIsModalOpen(true); }}
                                    loading={loadingIntegrations}
                                />
                                <PlatformCard
                                    icon={Send}
                                    iconBg="bg-blue-500"
                                    name="Telegram"
                                    description="Connect a Telegram bot for automated service"
                                    connected={false} // Will update state logic later
                                    onConnect={() => { setSelectedPlatform('telegram'); setIsModalOpen(true); }}
                                    onDisconnect={() => { setSelectedPlatform('telegram'); setIsModalOpen(true); }}
                                    loading={false}
                                />
                                <PlatformCard
                                    icon={Facebook}
                                    iconBg="bg-blue-700"
                                    name="Facebook Messenger"
                                    description="Respond to Facebook Page messages"
                                    connected={false} // Will update state logic later
                                    onConnect={() => { setSelectedPlatform('facebook'); setIsModalOpen(true); }}
                                    onDisconnect={() => { setSelectedPlatform('facebook'); setIsModalOpen(true); }}
                                    loading={false}
                                />
                                <PlatformCard
                                    icon={CreditCard}
                                    iconBg="bg-blue-500"
                                    name="Paystack"
                                    description="Payment links and webhook confirmation"
                                    connected={paystackStatus.connected}
                                    onConnect={() => addToast('Paystack integration coming soon', 'info')}
                                    onDisconnect={() => {}}
                                    loading={false}
                                />
                            </div>
                        </div>

                        {/* AI Configuration & Business Model */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                            <h2 className="text-lg font-bold text-dark">Business model</h2>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, business_type: 'product' })}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.business_type === 'product' ? 'border-primary bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <p className="font-bold text-sm text-dark">Product Seller</p>
                                    <p className="text-[10px] text-gray-500">I sell physical goods</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, business_type: 'service' })}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.business_type === 'service' ? 'border-primary bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <p className="font-bold text-sm text-dark">Service Provider</p>
                                    <p className="text-[10px] text-gray-500">I offer appointments</p>
                                </button>
                            </div>

                            <h2 className="text-lg font-bold text-dark pt-2">AI configuration</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Agent name</label>
                                <input
                                    type="text"
                                    name="agent_name"
                                    value={formData.agent_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-0 transition-all text-sm font-medium"
                                    placeholder="e.g. Kasi"
                                />
                                <p className="text-xs text-gray-400">How your custom AI sales manager introduces itself to customers.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business description</label>
                                <textarea
                                    name="business_bio"
                                    value={formData.business_bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-0 transition-all text-sm"
                                    placeholder="We sell premium authentic electronics — phones, laptops, audio gear — all with warranty."
                                />
                                <p className="text-xs text-gray-400">Kasi reads this to understand your brand voice.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Physical store address (optional)</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-0 transition-all text-sm"
                                    placeholder="e.g. Shop 4, Ikeja Computer Village, Lagos"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-green-700 text-white py-3 rounded-xl shadow-lg shadow-green-200 font-semibold"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </div>

                    {/* Subscription Quick Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-dark mb-2">Subscription & Plan</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-dark capitalize">{billingDetails?.subscription_tier === 'free_trial' ? '14-Day Free Trial' : `${billingDetails?.subscription_tier || 'starter'} Plan`}</p>
                                <p className="text-sm text-gray-500">
                                    {billingDetails?.subscription_status === 'trialing' 
                                        ? `${billingDetails?.days_remaining} days remaining in trial` 
                                        : `Active billing plan managed via Paystack`
                                    }
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">{billingDetails?.subscription_status || 'trialing'}</span>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setActiveTab('billing')} className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                Manage Billing & Upgrades
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SETTLEMENT & PAYOUTS TAB ─────────────────────── */}
            {activeTab === 'payment' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                            <Wallet className="text-primary" size={24} />
                            Settlement & Payouts
                        </h2>
                        <p className="text-sm text-gray-500 -mt-3">
                            When customers buy from your WhatsApp catalog or AI agents, payments are split instantly. Your revenue lands directly in your bank account minus Kasi's 2.0% platform fee.
                        </p>

                        {billingDetails?.account_number ? (
                            <div className="space-y-6">
                                <div className="bg-[#ECFDF3] border border-[#B0D9C1] rounded-2xl p-5 flex gap-4 text-sm text-[#027A48]">
                                    <ShieldCheck size={24} className="shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-base">Direct Settlement Enabled</h4>
                                        <p className="text-xs text-[#027A48]/80 leading-relaxed">
                                            Your bank account is fully verified. Payments made by your customers are split instantly at the payment processor level via your custom Paystack Subaccount. Kasi holds zero vendor funds.
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50/50">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settlement Bank Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-gray-400 text-xs">Bank Name</p>
                                            <p className="font-bold text-gray-800">{billingDetails?.bank_name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-400 text-xs">Account Number</p>
                                            <p className="font-bold text-gray-800 font-mono tracking-wider">{billingDetails?.account_number}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-400 text-xs">Resolved Account Name</p>
                                            <p className="font-bold text-gray-800">{billingDetails?.account_name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-[#FEF3F2] border border-[#FECDCA] rounded-2xl p-5 flex gap-4 text-sm text-[#B42318]">
                                    <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-base">No Settlement Bank Connected</h4>
                                        <p className="text-xs text-[#B42318]/80 leading-relaxed">
                                            You must set up a settlement account to start collecting payments. Kasi cannot initialize checkout links for your items without a payout destination.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 border border-gray-100 rounded-2xl p-6 bg-white shadow-xs">
                                    <h3 className="font-bold text-gray-800 text-sm">Connect settlement destination</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-[#344054]">SELECT BANK</label>
                                            <select
                                                value={bankCode}
                                                onChange={(e) => {
                                                    setBankCode(e.target.value);
                                                    const selected = banksList.find(b => b.code === e.target.value);
                                                    setFormData({ ...formData, bank_name: selected ? selected.name : '' });
                                                    setIsBankVerified(false);
                                                    setFormData(prev => ({ ...prev, account_name: '' }));
                                                }}
                                                className="w-full h-11 px-3.5 border border-[#D0D5DD] bg-white rounded-xl text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all"
                                            >
                                                <option value="">Choose bank...</option>
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
                                                value={formData.account_number}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '') });
                                                    setIsBankVerified(false);
                                                    setFormData(prev => ({ ...prev, account_name: '' }));
                                                }}
                                                placeholder="e.g. 0123456789"
                                                className="w-full h-11 px-3.5 border border-[#D0D5DD] bg-white rounded-xl text-sm text-[#101828] focus:border-[#1A7A4A] focus:ring-4 focus:ring-[#1A7A4A]/12 outline-none transition-all font-mono tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    {formData.account_name && (
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex justify-between items-center animate-in fade-in duration-300">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-semibold text-[#667085] tracking-wider uppercase font-sans">RESOLVED ACCOUNT NAME</span>
                                                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                                                    <CheckCircle size={14} className="text-[#1A7A4A]" />
                                                    {formData.account_name}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!isBankVerified ? (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (formData.account_number.length !== 10) {
                                                    addToast('Nigerian bank account numbers must be 10 digits.', 'error');
                                                    return;
                                                }
                                                if (!bankCode) {
                                                    addToast('Please select a bank first.', 'error');
                                                    return;
                                                }
                                                setVerifyingBank(true);
                                                try {
                                                    const res = await api.post('/api/billing/resolve-bank', {
                                                        account_number: formData.account_number,
                                                        bank_code: bankCode
                                                    });
                                                    if (res.data && res.data.data) {
                                                        setFormData(prev => ({ ...prev, account_name: res.data.data.account_name }));
                                                        setIsBankVerified(true);
                                                        addToast('Bank account successfully verified!', 'success');
                                                    }
                                                } catch (err) {
                                                    addToast(err.response?.data?.error || 'Verification failed.', 'error');
                                                } finally {
                                                    setVerifyingBank(false);
                                                }
                                            }}
                                            disabled={verifyingBank || formData.account_number.length !== 10 || !bankCode}
                                            className="w-full h-11 bg-white border border-[#D0D5DD] hover:bg-slate-50 text-[#344054] text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                                        >
                                            {verifyingBank ? 'Resolving NIBSS Details...' : 'Verify Bank Details'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setConnectingSubaccount(true);
                                                try {
                                                    await api.post('/api/onboarding/paystack/connect', {
                                                        bank_code: bankCode,
                                                        account_number: formData.account_number,
                                                        bank_name: formData.bank_name
                                                    });
                                                    addToast('Settlement destination connected successfully!', 'success');
                                                    fetchBillingDetails();
                                                } catch (err) {
                                                    addToast(err.response?.data?.message || 'Failed to connect subaccount.', 'error');
                                                } finally {
                                                    setConnectingSubaccount(false);
                                                }
                                            }}
                                            disabled={connectingSubaccount}
                                            className="w-full h-11 bg-primary text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                                        >
                                            {connectingSubaccount ? 'Connecting Payout Subaccount...' : 'Save & Enable Split Payouts'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── AI RULES TAB ─────────────────────── */}
            {activeTab === 'ai_rules' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                            <Brain className="text-primary" size={24} />
                            Custom AI Instructions
                        </h2>
                        <p className="text-sm text-gray-500 -mt-3">Teach Kasi how to talk to your customers. Add your specific return policies, delivery times, or brand tone here.</p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Business Context & Rules</label>
                            <textarea
                                name="ai_instructions"
                                value={formData.ai_instructions}
                                onChange={handleChange}
                                rows={8}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium text-sm"
                                placeholder="E.g., 'We do not offer refunds, only exchanges. Standard delivery takes 3-5 days in Lagos for ₦3,000. Always end your messages with: Stay Beautiful!'"
                            />
                        </div>

                        {/* Business Brain fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Delivery Information</label>
                                <textarea name="delivery_details" value={formData.delivery_details} onChange={handleChange} rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium text-sm"
                                    placeholder="Cost, timeline, and coverage." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Payment Instructions</label>
                                <textarea name="payment_details" value={formData.payment_details} onChange={handleChange} rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium text-sm"
                                    placeholder="How should customers pay?" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Instagram Handle</label>
                                <input type="text" name="instagram_handle" value={formData.instagram_handle} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium"
                                    placeholder="@yourstore" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Opening Hours</label>
                                <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium"
                                    placeholder="Mon-Fri, 9AM-6PM" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}
                            className="bg-primary hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-green-200 inline-flex items-center gap-2">
                            {loading ? 'Saving...' : 'Save Changes'}
                            <Save size={20} className="ml-2" />
                        </Button>
                    </div>
                </form>
            )}

            {/* ── APPEARANCE TAB ──────────────────── */}
            {/*
            activeTab === 'appearance' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                                <Palette className="text-primary" size={24} />
                                Theme
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Choose a theme that matches your vibe. Changes apply instantly.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {THEMES.map((t) => (
                                <ThemeCard key={t.id} theme={t} isSelected={currentTheme === t.id} onSelect={setTheme} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-dark">Pro tip:</span> Your selected theme is saved automatically and persists across sessions.
                        </p>
                    </div>
                </div>
            )
            */}
            
            {/* ── ACTIVITY LOGS TAB ──────────────────── */}
            {activeTab === 'activity' && (
                <ActivityLogsTable />
            )}

            {/* ── BILLING & SUBSCRIPTIONS TAB ─────────────────────── */}
            {activeTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Active Plan Banner */}
                    <div className="bg-[#0F1F0F] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden select-none">
                        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#D4F263] uppercase bg-[#D4F263]/10 border border-[#D4F263]/25 px-2.5 py-1 rounded-full">
                                    CURRENT SUBSCRIPTION STATUS
                                </span>
                                <h2 className="text-2xl font-black tracking-tight leading-tight capitalize">
                                    {billingDetails?.subscription_tier === 'free_trial' ? '14-Day Free Trial' : `${billingDetails?.subscription_tier || 'starter'} Plan`}
                                </h2>
                                <p className="text-white/60 text-xs leading-relaxed">
                                    {billingDetails?.subscription_status === 'trialing' ? (
                                        <>Your free trial has <span className="text-white font-bold">{billingDetails?.days_remaining} days</span> remaining. Upgrade below to keep selling without interruption.</>
                                    ) : billingDetails?.subscription_status === 'active' ? (
                                        <>Renews on <span className="text-white font-bold">{billingDetails?.subscription_expires_at ? new Date(billingDetails.subscription_expires_at).toLocaleDateString() : 'N/A'}</span>. Managed securely via Paystack.</>
                                    ) : billingDetails?.subscription_status === 'cancelled' ? (
                                        <>Your plan is cancelled but remains active until <span className="text-white font-bold">{billingDetails?.subscription_expires_at ? new Date(billingDetails.subscription_expires_at).toLocaleDateString() : 'N/A'}</span>.</>
                                    ) : (
                                        <>No active subscription. Upgrade to a premium plan below.</>
                                    )}
                                </p>
                            </div>
                            
                            {billingDetails?.subscription_status === 'active' && (
                                <button
                                    onClick={handleCancelSubscription}
                                    disabled={loading}
                                    className="px-4 py-2 border border-white/20 hover:border-red-400 hover:text-red-400 rounded-xl text-xs font-bold transition-all text-white/80 shrink-0"
                                >
                                    Cancel Subscription
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Subscription Plans Selection Card Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-800">Available Plans ({billingDetails?.subscription_type === 'service' ? 'Service Kasi' : 'Product Kasi'})</h3>
                            <span className="text-xs text-gray-400">Monthly auto-renew billing via Paystack</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                            {[
                                {
                                    id: 'starter',
                                    name: 'Starter',
                                    price: billingDetails?.subscription_type === 'service' ? '₦15,000' : '₦18,000',
                                    features: billingDetails?.subscription_type === 'service' ? [
                                        'AI booking agent on WhatsApp',
                                        '1 Active Booking Schedule/Calendar',
                                        'Appointment booking directly in DM',
                                        'Paystack subaccount integration',
                                        'Basic analytics & dashboard summary'
                                    ] : [
                                        'AI sales agent on WhatsApp',
                                        'Unlimited catalog with voice pitch',
                                        'Automatic inventory tracking',
                                        'Paystack subaccount integration',
                                        'Basic analytics & dashboard summary'
                                    ]
                                },
                                {
                                    id: 'growth',
                                    name: 'Growth',
                                    price: billingDetails?.subscription_type === 'service' ? '₦24,000' : '₦29,000',
                                    badge: 'MOST POPULAR',
                                    isPopular: true,
                                    features: billingDetails?.subscription_type === 'service' ? [
                                        'Everything in Starter',
                                        'Connect all DMs (WhatsApp, IG, Messenger)',
                                        'Google Calendar two-way sync',
                                        'Automated booking reminders',
                                        'Broadcast marketing campaigns'
                                    ] : [
                                        'Everything in Starter',
                                        'Connect all DMs (WhatsApp, IG, Messenger)',
                                        'Full margin & deal value analytics',
                                        'Voice pitch audio generation',
                                        'Broadcast marketing campaigns'
                                    ]
                                },
                                {
                                    id: 'premium',
                                    name: 'Premium',
                                    price: billingDetails?.subscription_type === 'service' ? '₦32,000' : '₦40,000',
                                    features: billingDetails?.subscription_type === 'service' ? [
                                        'Everything in Growth',
                                        'Full client interaction database',
                                        'Proactive lead re-engagement in DM',
                                        'Social comments auto-outreach',
                                        '24/7 dedicated hosting & priority support'
                                    ] : [
                                        'Everything in Growth',
                                        'Full customer interaction database',
                                        'Proactive lead re-engagement in DM',
                                        'Social comments auto-outreach',
                                        '24/7 dedicated hosting & priority support'
                                    ]
                                }
                            ].map((plan) => {
                                const isCurrent = billingDetails?.subscription_tier === plan.id;
                                return (
                                    <div
                                        key={plan.id}
                                        className={`rounded-2xl p-6 flex flex-col justify-between text-left transition-all duration-300 relative border ${
                                            plan.isPopular
                                                ? 'bg-green-50/40 border-primary shadow-md shadow-green-50'
                                                : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        {plan.badge && (
                                            <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4F263] border border-black/15 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                {plan.badge}
                                            </span>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">{plan.name}</span>
                                                <div className="flex items-baseline mt-1">
                                                    <span className="text-3xl font-black text-gray-800 tracking-tight">{plan.price}</span>
                                                    <span className="text-xs text-gray-400 ml-1 font-semibold">/month</span>
                                                </div>
                                            </div>

                                            {isCurrent ? (
                                                <button
                                                    disabled
                                                    className="w-full py-2.5 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl border border-gray-200 select-none"
                                                >
                                                    Current Plan
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleInitializeSubscription(plan.id)}
                                                    disabled={loading}
                                                    className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all shadow-xs border ${
                                                        plan.isPopular
                                                            ? 'bg-primary hover:bg-green-700 text-white border-primary'
                                                            : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    Upgrade to {plan.name}
                                                </button>
                                            )}

                                            <hr className="border-t border-gray-100" />

                                            <ul className="space-y-2.5">
                                                {plan.features.map((f, idx) => (
                                                    <li key={idx} className="flex gap-2 items-start text-xs text-gray-600 leading-normal">
                                                        <Check size={14} className="text-[#1A7A4A] shrink-0 mt-0.5" strokeWidth={2.5} />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ledger Entries Audit Logs */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Billing History & Audit Ledger</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Every transaction is recorded transparently on our system immutable database.</p>
                        </div>

                        {billingDetails?.ledger_entries && billingDetails.ledger_entries.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-1">Date</th>
                                            <th className="py-3 px-1">Description</th>
                                            <th className="py-3 px-1">Amount</th>
                                            <th className="py-3 px-1">Reference ID</th>
                                            <th className="py-3 px-1 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {billingDetails.ledger_entries.map((entry) => (
                                            <tr key={entry.id} className="text-xs text-gray-600 hover:bg-gray-50/50">
                                                <td className="py-3 px-1 font-medium">{new Date(entry.created_at).toLocaleDateString()}</td>
                                                <td className="py-3 px-1">{entry.description}</td>
                                                <td className="py-3 px-1 font-bold text-gray-800">
                                                    {entry.currency === 'NGN' ? '₦' : entry.currency}{entry.amount.toLocaleString()}
                                                </td>
                                                <td className="py-3 px-1 font-mono">{entry.reference_id}</td>
                                                <td className="py-3 px-1 text-right">
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 capitalize">
                                                        {entry.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs bg-gray-50/50 rounded-xl border border-dashed border-gray-200 select-none">
                                No billing records found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
