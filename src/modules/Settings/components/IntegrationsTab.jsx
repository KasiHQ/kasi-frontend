import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Instagram, CheckCircle, XCircle,
  ExternalLink, Copy, Loader2, Wifi, WifiOff, RefreshCw, LogOut, Zap, Facebook, Cpu,
  ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, Sparkles
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import useNetwork from '../../../hooks/useNetwork';
import { META_APP_ID } from '../../../config';
import { conversationAPI } from '../../../api/conversations';

const IntegrationsTab = ({ standalone = true, focusedPlatform = null }) => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();

  // Telegram state
  const [telegramStatus, setTelegramStatus] = useState({ connected: false, bot: null });
  const [botToken, setBotToken] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // WhatsApp state
  const [waPhoneNumber, setWaPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connectingWA, setConnectingWA] = useState(false);
  const [connectingMetaWA, setConnectingMetaWA] = useState(false);
  const [disconnectingWA, setDisconnectingWA] = useState(false);
  const [waStatus, setWaStatus] = useState({ connected: false, status: 'disconnected', platform: null, instanceName: '' });
  const [loadingWA, setLoadingWA] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showLegacyWA, setShowLegacyWA] = useState(false);

  // Instagram state
  const [connectingIG, setConnectingIG] = useState(false);
  const [disconnectingIG, setDisconnectingIG] = useState(false);
  const [igStatus, setIgStatus] = useState({ connected: false, status: 'disconnected', pageId: '' });
  const [loadingIG, setLoadingIG] = useState(true);

  // Facebook state
  const [connectingFB, setConnectingFB] = useState(false);
  const [disconnectingFB, setDisconnectingFB] = useState(false);
  const [fbStatus, setFbStatus] = useState({ connected: false, status: 'disconnected', pageId: '' });
  const [loadingFB, setLoadingFB] = useState(true);

  // Global Kasi status state
  const [isAutomated, setIsAutomated] = useState(true);

  const pairingCodeRef = useRef(pairingCode);
  pairingCodeRef.current = pairingCode;

  useEffect(() => {
    fetchTelegramStatus();
    fetchWhatsAppStatus();
    fetchInstagramStatus();
    fetchFacebookStatus();
    fetchGlobalGatekeeperStatus();

    const interval = setInterval(() => {
      if (!waStatus.connected) {
        fetchWhatsAppStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [waStatus.connected]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // 'instagram', 'facebook', or 'whatsapp_meta'

    if (code && (state === 'instagram' || state === 'facebook' || state === 'whatsapp_meta')) {
      // Clear query params to prevent reload loop
      window.history.replaceState({}, document.title, window.location.pathname);
      completeOAuthConnection(code, state);
    }
  }, []);

  const fetchTelegramStatus = async () => {
    try {
      if (!isOnline) { setLoadingStatus(false); return; }
      const res = await api.get('/api/telegram/status');
      setTelegramStatus(res.data);
    } catch { } finally { setLoadingStatus(false); }
  };

  const fetchWhatsAppStatus = async () => {
    try {
      const res = await api.get('/api/whatsapp/status');
      const integrations = res.data.integrations || [];
      const metaIntegration = integrations.find(int => int.platform === 'whatsapp_meta');
      const evoIntegration = integrations.find(int => int.platform === 'whatsapp');

      setWaStatus({
        connected: res.data.connected,
        status: res.data.status,
        instanceName: res.data.instance_name,
        platform: metaIntegration ? 'whatsapp_meta' : (evoIntegration ? 'whatsapp' : null)
      });
      if (res.data.connected && pairingCodeRef.current) {
        setPairingCode('');
        addToast('WhatsApp connected successfully!', 'success');
      }
    } catch { } finally { setLoadingWA(false); }
  };

  const fetchInstagramStatus = async () => {
    try {
      if (!isOnline) { setLoadingIG(false); return; }
      const res = await api.get('/api/whatsapp/status');
      const integrations = res.data.integrations || [];
      const instagramIntegration = integrations.find(int => int.platform === 'instagram');
      setIgStatus({ 
        connected: instagramIntegration?.connection_status === 'connected' && instagramIntegration?.instance_name,
        status: instagramIntegration?.connection_status || 'disconnected',
        pageId: instagramIntegration?.instance_name || ''
      });
    } catch {
      setIgStatus({ connected: false, status: 'disconnected', pageId: '' });
    } finally { setLoadingIG(false); }
  };

  const fetchFacebookStatus = async () => {
    try {
      if (!isOnline) { setLoadingFB(false); return; }
      const res = await api.get('/api/whatsapp/status');
      const integrations = res.data.integrations || [];
      const facebookIntegration = integrations.find(int => int.platform === 'facebook');
      setFbStatus({ 
        connected: facebookIntegration?.connection_status === 'connected' && facebookIntegration?.instance_name,
        status: facebookIntegration?.connection_status || 'disconnected',
        pageId: facebookIntegration?.instance_name || ''
      });
    } catch {
      setFbStatus({ connected: false, status: 'disconnected', pageId: '' });
    } finally { setLoadingFB(false); }
  };

  const fetchGlobalGatekeeperStatus = async () => {
    try {
      const res = await conversationAPI.getGlobalGatekeeperStatus();
      setIsAutomated(res.is_automated);
    } catch (err) {
      console.error('Failed to fetch global gatekeeper status:', err);
    }
  };

  const handleToggleAutomated = async () => {
    try {
      const nextVal = !isAutomated;
      setIsAutomated(nextVal);
      await conversationAPI.toggleGlobalGatekeeper(nextVal);
      addToast(nextVal ? 'Kasi AI is running!' : 'Kasi AI is paused!', 'success');
    } catch (err) {
      console.error('Failed to toggle global gatekeeper:', err);
      addToast('Failed to toggle automation state', 'error');
      setIsAutomated(isAutomated);
    }
  };

  const connectTelegram = async () => {
    if (!botToken.trim()) { addToast('Please enter your bot token', 'error'); return; }
    setConnecting(true);
    try {
      const res = await api.post('/api/telegram/connect', { bot_token: botToken.trim() });
      setTelegramStatus({ connected: true, bot: res.data.bot });
      setBotToken('');
      addToast('Telegram bot connected!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to connect', 'error');
    } finally { setConnecting(false); }
  };

  const disconnectTelegram = async () => {
    if (!confirm('Disconnect your Telegram bot?')) return;
    try {
      await api.delete('/api/telegram/disconnect');
      setTelegramStatus({ connected: false, bot: null });
      addToast('Bot disconnected', 'success');
    } catch { addToast('Failed to disconnect', 'error'); }
  };

  const connectWhatsApp = async () => {
    if (!waPhoneNumber.trim()) { addToast('Please enter your phone number', 'error'); return; }
    const cleanNumber = waPhoneNumber.replace(/\D/g, '');
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
    } finally { setConnectingWA(false); }
  };

  const disconnectWhatsApp = async () => {
    setDisconnectingWA(true);
    setShowDisconnectConfirm(false);
    try {
      await api.post('/api/whatsapp/disconnect');
      setWaStatus({ connected: false, status: 'disconnected' });
      setPairingCode('');
      setWaPhoneNumber('');
      addToast('WhatsApp disconnected successfully.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to disconnect', 'error');
    } finally { setDisconnectingWA(false); }
  };

  const copyPairingCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCodeCopied(true);
    addToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleFacebookAuth = (platform) => {
    const clientId = META_APP_ID;
    const redirectUri = window.location.origin + '/settings';
    const scope = 'pages_show_list,pages_messaging,pages_manage_metadata,instagram_basic,instagram_manage_messages,pages_read_engagement';
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=${platform}`;
    window.location.href = authUrl;
  };

  const connectInstagram = () => handleFacebookAuth('instagram');

  const disconnectInstagram = async () => {
    if (!confirm('Disconnect Instagram?')) return;
    setDisconnectingIG(true);
    try {
      await api.delete('/api/meta/disconnect', { data: { platform: 'instagram' } });
      setIgStatus({ connected: false, status: 'disconnected', pageId: '' });
      addToast('Instagram disconnected successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to disconnect', 'error');
    } finally { setDisconnectingIG(false); }
  };

  const connectFacebook = () => handleFacebookAuth('facebook');

  const disconnectFacebook = async () => {
    if (!confirm('Disconnect Facebook Messenger?')) return;
    setDisconnectingFB(true);
    try {
      await api.delete('/api/meta/disconnect', { data: { platform: 'facebook' } });
      setFbStatus({ connected: false, status: 'disconnected', pageId: '' });
      addToast('Facebook Messenger disconnected successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to disconnect', 'error');
    } finally { setDisconnectingFB(false); }
  };

  const connectMetaWhatsApp = () => {
    const clientId = META_APP_ID;
    const redirectUri = window.location.origin + '/settings';
    const scope = 'whatsapp_business_management,whatsapp_business_messaging';
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=whatsapp_meta`;
    window.location.href = authUrl;
  };

  const completeOAuthConnection = async (code, platform) => {
    if (platform === 'instagram') setConnectingIG(true);
    else if (platform === 'facebook') setConnectingFB(true);
    else if (platform === 'whatsapp_meta') setConnectingMetaWA(true);

    try {
      const redirectUri = window.location.origin + '/settings';
      if (platform === 'whatsapp_meta') {
        await api.post('/api/meta/whatsapp/oauth/callback', {
          code,
          redirect_uri: redirectUri
        });
        addToast('WhatsApp connected successfully via Meta Cloud API!', 'success');
        fetchWhatsAppStatus();
      } else {
        await api.post('/api/meta/oauth/callback', {
          code,
          platform,
          redirect_uri: redirectUri
        });
        addToast(`${platform === 'instagram' ? 'Instagram' : 'Facebook Messenger'} connected successfully!`, 'success');
        if (platform === 'instagram') fetchInstagramStatus();
        else fetchFacebookStatus();
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to complete connection', 'error');
    } finally {
      setConnectingIG(false);
      setConnectingFB(false);
      setConnectingMetaWA(false);
    }
  };

  const formatCode = (code) => {
    if (!code) return ['', ''];
    const clean = code.replace(/[-\s]/g, '');
    return [clean.slice(0, 4), clean.slice(4, 8)];
  };

  const [codeA, codeB] = formatCode(pairingCode);

  const renderWhatsApp = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${waStatus.connected ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${waStatus.connected ? 'bg-green-500' : 'bg-green-600'}`}>
              <MessageCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-dark dark:text-white">WhatsApp Business</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-md">
                Official Meta Cloud
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Link your WhatsApp Business number for 24/7 AI sales, product recommendations, and instant invoices.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {loadingWA ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking connection...
            </div>
          ) : waStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-700 dark:text-green-400">
                      <Wifi size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-green-800 dark:text-green-300 text-sm">WhatsApp is live!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                        {waStatus.platform === 'whatsapp_meta' ? 'Connected via Official Meta Cloud API' : 'Connected via Evolution Engine'}
                        {waStatus.instanceName && ` • ID: ${waStatus.instanceName}`}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-200/60 dark:bg-green-500/30 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDisconnectConfirm(true)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                Disconnect WhatsApp
              </button>
              {showDisconnectConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3 mt-2">
                  <p className="text-sm font-semibold text-red-800">Are you sure you want to disconnect WhatsApp?</p>
                  <div className="flex gap-2">
                    <button onClick={disconnectWhatsApp} disabled={disconnectingWA} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                      {disconnectingWA ? 'Disconnecting...' : 'Yes, Disconnect'}
                    </button>
                    <button onClick={() => setShowDisconnectConfirm(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Primary: Meta Official Embedded Signup */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10 border border-green-100 dark:border-green-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-xs font-bold text-green-800 dark:text-green-300">Recommended • Enterprise Grade</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Connect directly with your Meta Business account for 100% uptime, verified branding, and official Meta Cloud API infrastructure.
                </p>
                <button
                  onClick={connectMetaWhatsApp}
                  disabled={connectingMetaWA}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageCircle size={16} />
                  {connectingMetaWA ? 'Connecting with Meta...' : 'Connect WhatsApp with Meta'}
                </button>
              </div>

              {/* Secondary Option Underneath: Legacy Pairing Code Test Mode */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <button
                  onClick={() => setShowLegacyWA(!showLegacyWA)}
                  className="flex items-center justify-between w-full text-left py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle size={13} className="text-amber-500" />
                    Alternative: Quick Sandbox Test Mode (Pairing Code)
                  </span>
                  {showLegacyWA ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showLegacyWA && (
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use this option only to quickly test Kasi on a spare phone number before completing Meta Business verification.
                    </p>

                    {pairingCode ? (
                      <div className="text-center space-y-3 py-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Enter this pairing code in WhatsApp &gt; Linked Devices:</p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-xl font-bold tracking-widest text-dark dark:text-white">{codeA}</div>
                          <span className="text-gray-400 font-bold">—</span>
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-xl font-bold tracking-widest text-dark dark:text-white">{codeB}</div>
                        </div>
                        <button onClick={() => { setPairingCode(''); setWaPhoneNumber(''); }} className="text-xs text-primary hover:underline">
                          Start over with different number
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="tel"
                          value={waPhoneNumber}
                          onChange={(e) => setWaPhoneNumber(e.target.value)}
                          placeholder="Phone number (e.g. 2348031234567)"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-xs outline-none focus:border-primary"
                        />
                        <button
                          onClick={connectWhatsApp}
                          disabled={connectingWA || !waPhoneNumber.trim()}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
                        >
                          {connectingWA ? 'Generating...' : 'Get Pairing Code'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTelegram = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${telegramStatus.connected ? 'border-blue-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
            <Send size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-dark dark:text-white">Telegram</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Respond to customer messages via a Telegram bot.</p>
          </div>
        </div>

        <div className="mt-6">
          {loadingStatus ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking status...
            </div>
          ) : telegramStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-700 dark:text-blue-400"><CheckCircle size={18} /></div>
                  <p className="font-bold text-blue-800 dark:text-blue-300 text-sm">@{telegramStatus.bot?.bot_username} is active!</p>
                </div>
              </div>
              <button onClick={disconnectTelegram} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                Disconnect Bot
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} placeholder="Enter Bot Token from @BotFather" className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl text-sm outline-none focus:border-primary" />
              <button onClick={connectTelegram} disabled={connecting || !botToken.trim()} className="px-6 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                {connecting ? 'Verifying...' : 'Connect'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${igStatus.connected ? 'border-pink-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Instagram size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-dark dark:text-white">Instagram</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your Instagram Business account.</p>
          </div>
        </div>

        <div className="mt-6">
          {loadingIG ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking status...
            </div>
          ) : igStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-lg text-pink-700 dark:text-pink-400"><CheckCircle size={18} /></div>
                  <div>
                    <p className="font-bold text-pink-800 dark:text-pink-300 text-sm">Instagram is active!</p>
                    {igStatus.pageId && <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">Account ID: {igStatus.pageId}</p>}
                  </div>
                </div>
              </div>
              <button onClick={disconnectInstagram} disabled={disconnectingIG} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {disconnectingIG ? 'Disconnecting...' : 'Disconnect Instagram'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {connectingIG ? (
                <div className="flex items-center gap-2 text-pink-500 text-sm py-4 justify-center font-medium">
                  <Loader2 size={18} className="animate-spin text-pink-500" /> Authenticating & linking Instagram...
                </div>
              ) : (
                <button 
                  onClick={connectInstagram} 
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-pink-500/10 flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> Connect with Facebook
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFacebook = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${fbStatus.connected ? 'border-blue-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
            <Facebook size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-dark dark:text-white">Facebook Messenger</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your Facebook Page.</p>
          </div>
        </div>

        <div className="mt-6">
          {loadingFB ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking status...
            </div>
          ) : fbStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-700 dark:text-blue-400"><CheckCircle size={18} /></div>
                  <div>
                    <p className="font-bold text-blue-800 dark:text-blue-300 text-sm">Facebook Messenger is active!</p>
                    {fbStatus.pageId && <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Page ID: {fbStatus.pageId}</p>}
                  </div>
                </div>
              </div>
              <button onClick={disconnectFacebook} disabled={disconnectingFB} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {disconnectingFB ? 'Disconnecting...' : 'Disconnect Facebook'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {connectingFB ? (
                <div className="flex items-center gap-2 text-blue-600 text-sm py-4 justify-center font-medium">
                  <Loader2 size={18} className="animate-spin text-blue-600" /> Authenticating & linking Page...
                </div>
              ) : (
                <button 
                  onClick={connectFacebook} 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> Connect with Facebook
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (focusedPlatform) {
      if (focusedPlatform === 'whatsapp') return renderWhatsApp();
      if (focusedPlatform === 'telegram') return renderTelegram();
      if (focusedPlatform === 'instagram') return renderInstagram();
      if (focusedPlatform === 'facebook') return renderFacebook();
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Global Kasi AI status banner */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isAutomated ? 'bg-[#ECFDF3]' : 'bg-[#FEF3C7]'}`}>
            <Cpu size={20} className={isAutomated ? 'text-[#12B76A]' : 'text-[#F79009]'} />
          </div>
          <div>
            <h3 className="font-bold text-dark dark:text-white flex items-center gap-2">
              Kasi AI Assistant 
              <span className={`inline-flex items-center w-2 h-2 rounded-full ${isAutomated ? 'bg-[#12B76A] animate-pulse' : 'bg-[#F79009]'}`} />
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isAutomated 
                ? "Kasi is actively responding to your customers on all connected platforms." 
                : "Kasi is paused. Customers will not receive automated responses."}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleAutomated}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAutomated ? 'bg-[#1A7A4A]' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAutomated ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderWhatsApp()}
        {renderTelegram()}
        {renderInstagram()}
        {renderFacebook()}
      </div>
    </div>
  );
};

export default IntegrationsTab;
