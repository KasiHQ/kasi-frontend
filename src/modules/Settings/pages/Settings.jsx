import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme, THEMES } from '../../../context/ThemeContext';
import Button from '../../../components/ui/Button';
import api from '../../../api/axios';
import { Save, Building, Phone, MapPin, CreditCard, Image as ImageIcon, Palette, User, Check, Brain, History, Wifi, WifiOff, MessageCircle, Instagram, Calendar, Zap, HelpCircle, FileText, ExternalLink, Send, Facebook, Layout } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('integrations'); // Default to integrations per user request
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Integration states
    const [waStatus, setWaStatus] = useState({ connected: false });
    const [igStatus, setIgStatus] = useState({ connected: false });
    const [paystackStatus, setPaystackStatus] = useState({ connected: false });
    const [loadingIntegrations, setLoadingIntegrations] = useState(true);

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
        business_type: ''
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
                business_type: user.business_type || 'product'
            });
        }
    }, [user]);

    useEffect(() => {
        fetchIntegrationStatuses();
    }, []);

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
                <TabButton active={activeTab === 'payment'} icon={CreditCard} label="Payment" onClick={() => setActiveTab('payment')} />
                <TabButton active={activeTab === 'ai_rules'} icon={Brain} label="AI Rules" onClick={() => setActiveTab('ai_rules')} />
                <TabButton active={activeTab === 'appearance'} icon={Palette} label="Appearance" onClick={() => setActiveTab('appearance')} />
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
                                    value="Kasi"
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium"
                                />
                                <p className="text-xs text-gray-400">How Kasi introduces itself to customers.</p>
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

                    {/* Subscription */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-dark mb-2">Subscription</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-dark">Pro Plan</p>
                                <p className="text-sm text-gray-500">All features · Renews 9 June 2026</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                View Invoice
                            </button>
                            <button className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                Change Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PAYMENT TAB ─────────────────────── */}
            {activeTab === 'payment' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                            <CreditCard className="text-primary" size={24} />
                            Payment Information
                        </h2>
                        <p className="text-sm text-gray-500 -mt-3">This info appears on your invoices so customers know where to send payment.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Bank Name</label>
                                <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium"
                                    placeholder="GTBank, Zenith, Opay..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Account Number</label>
                                <input type="text" name="account_number" value={formData.account_number} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium"
                                    placeholder="0123456789" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Account Name</label>
                                <input type="text" name="account_name" value={formData.account_name} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 transition-all font-medium"
                                    placeholder="Must match your business name" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Preview */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Invoice Preview</h3>
                        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-3">Payment Details</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs mb-0.5">Bank</p>
                                    <p className="font-semibold text-gray-800">{formData.bank_name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-0.5">Account</p>
                                    <p className="font-semibold text-gray-800">{formData.account_number || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-0.5">Name</p>
                                    <p className="font-semibold text-gray-800">{formData.account_name || '—'}</p>
                                </div>
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
            {activeTab === 'appearance' && (
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
            )}
            
            {/* ── ACTIVITY LOGS TAB ──────────────────── */}
            {activeTab === 'activity' && (
                <ActivityLogsTable />
            )}
        </div>
    );
};

export default Settings;
