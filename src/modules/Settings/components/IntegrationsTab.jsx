import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink, Copy, Loader2, Wifi, WifiOff, RefreshCw, LogOut, Zap, Cpu,
  ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, Sparkles, Check, CheckCircle2
} from 'lucide-react';
import { SiWhatsapp, SiTelegram, SiInstagram, SiMessenger } from 'react-icons/si';
import { PiCheckCircleFill, PiArrowSquareOut, PiCopy, PiShieldCheck, PiLightning } from 'react-icons/pi';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import useNetwork from '../../../hooks/useNetwork';
import { META_APP_ID, META_WHATSAPP_CONFIG_ID, META_HOSTED_ONBOARD_URL } from '../../../config';
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
  const sessionDataRef = useRef({ phone_number_id: null, waba_id: null });

  useEffect(() => {
    const handleMetaMessage = (event) => {
      if (typeof event.origin === 'string' && !event.origin.includes('facebook.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data || {};
            sessionDataRef.current = { phone_number_id, waba_id };
          }
        }
      } catch (e) {}
    };
    window.addEventListener('message', handleMetaMessage);
    return () => window.removeEventListener('message', handleMetaMessage);
  }, []);

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

      const isMetaConnected = metaIntegration?.connection_status === 'connected' && !!metaIntegration?.instance_name;
      const isConnected = Boolean(res.data.connected || isMetaConnected);

      setWaStatus({
        connected: isConnected,
        status: isConnected ? 'connected' : (res.data.status || 'disconnected'),
        instanceName: isConnected ? (res.data.instance_name || metaIntegration?.instance_name || '') : '',
        platform: isConnected ? (res.data.platform || (metaIntegration ? 'whatsapp_meta' : (evoIntegration ? 'whatsapp' : null))) : null
      });
      if (isConnected && pairingCodeRef.current) {
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
      await api.post('/api/whatsapp/disconnect', { platform: 'whatsapp' });
      setWaStatus({ connected: false, status: 'disconnected', instanceName: '', platform: null });
      setPairingCode('');
      setWaPhoneNumber('');
      addToast('WhatsApp disconnected successfully.', 'success');
      await fetchWhatsAppStatus();
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

  const loadFacebookSDK = () => {
    return new Promise((resolve) => {
      if (window.FB) return resolve(window.FB);
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: META_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v21.0'
        });
        resolve(window.FB);
      };
      if (!document.getElementById('facebook-jssdk')) {
        const js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        js.async = true;
        js.defer = true;
        document.body.appendChild(js);
      }
    });
  };

  const connectMetaWhatsApp = async () => {
    setConnectingMetaWA(true);
    try {
      const FB = await loadFacebookSDK();
      FB.login(
        (response) => {
          if (response.authResponse && response.authResponse.code) {
            const code = response.authResponse.code;
            const { phone_number_id, waba_id } = sessionDataRef.current || {};
            completeOAuthConnection(code, 'whatsapp_meta', { phone_number_id, waba_id });
          } else {
            setConnectingMetaWA(false);
          }
        },
        {
          config_id: META_WHATSAPP_CONFIG_ID,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            feature: 'whatsapp_embedded_signup',
            version: 2,
            sessionInfoVersion: 3
          }
        }
      );
    } catch (err) {
      console.error('Failed to launch Meta Embedded Signup popup:', err);
      setConnectingMetaWA(false);
      window.open(META_HOSTED_ONBOARD_URL, '_blank');
    }
  };

  const completeOAuthConnection = async (code, platform, extraData = {}) => {
    if (platform === 'instagram') setConnectingIG(true);
    else if (platform === 'facebook') setConnectingFB(true);
    else if (platform === 'whatsapp_meta') setConnectingMetaWA(true);

    try {
      const redirectUri = window.location.origin + '/settings';
      if (platform === 'whatsapp_meta') {
        await api.post('/api/meta/whatsapp/oauth/callback', {
          code,
          phone_number_id: extraData?.phone_number_id,
          waba_id: extraData?.waba_id,
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
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xs border overflow-hidden transition-all duration-200 ${waStatus.connected ? 'border-emerald-200 dark:border-emerald-900/40' : 'border-gray-200 dark:border-gray-700/60'}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/20">
            <SiWhatsapp size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">WhatsApp Business</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                Official Meta Cloud
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Link your WhatsApp Business number for 24/7 AI sales, catalog discovery, payment verification, and instant invoices.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {loadingWA ? (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-4 justify-center">
              <Loader2 size={15} className="animate-spin text-emerald-600" /> Checking connection status...
            </div>
          ) : waStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-lg p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-md text-emerald-700 dark:text-emerald-300">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs">WhatsApp is live!</p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {waStatus.platform === 'whatsapp_meta' ? 'Official Meta Cloud API' : 'Evolution Engine'}
                        {waStatus.instanceName && ` • ID: ${waStatus.instanceName}`}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDisconnectConfirm(true)} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-200/60">
                Disconnect WhatsApp
              </button>
              {showDisconnectConfirm && (
                <div className="bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg p-3.5 space-y-2.5 mt-2">
                  <p className="text-xs font-medium text-red-800 dark:text-red-300">Are you sure you want to disconnect WhatsApp?</p>
                  <div className="flex gap-2">
                    <button onClick={disconnectWhatsApp} disabled={disconnectingWA} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 disabled:opacity-50">
                      {disconnectingWA ? 'Disconnecting...' : 'Yes, Disconnect'}
                    </button>
                    <button onClick={() => setShowDisconnectConfirm(false)} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary: Meta Official Embedded Signup */}
              <div className="p-4 rounded-lg bg-gray-50/80 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <PiShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Recommended • Official Cloud API</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Direct connection with your Meta Business account for verified branding, highest message throughput, and guaranteed uptime.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={connectMetaWhatsApp}
                    disabled={connectingMetaWA}
                    className="px-4 py-2 bg-[#0D7043] hover:bg-[#0A5A35] text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <SiWhatsapp size={14} />
                    {connectingMetaWA ? 'Connecting with Meta...' : 'Connect WhatsApp with Meta'}
                  </button>
                  <a
                    href={META_HOSTED_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Onboard via Meta direct portal</span>
                    <PiArrowSquareOut size={13} />
                  </a>
                </div>
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
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xs border overflow-hidden transition-all duration-200 ${telegramStatus.connected ? 'border-sky-200 dark:border-sky-900/40' : 'border-gray-200 dark:border-gray-700/60'}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center shrink-0 border border-[#229ED9]/20">
            <SiTelegram size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Telegram</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Respond to customer inquiries and orders automatically via your dedicated Telegram bot.</p>
          </div>
        </div>

        <div className="mt-5">
          {loadingStatus ? (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-4 justify-center">
              <Loader2 size={15} className="animate-spin text-[#229ED9]" /> Checking status...
            </div>
          ) : telegramStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/40 rounded-lg p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-sky-100 dark:bg-sky-900/40 rounded-md text-[#229ED9]">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sky-900 dark:text-sky-200 text-xs">@{telegramStatus.bot?.bot_username} is active</p>
                      <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-0.5">Telegram Bot API linked</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/40 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>
              <button onClick={disconnectTelegram} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-200/60">
                Disconnect Bot
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input 
                type="text" 
                value={botToken} 
                onChange={(e) => setBotToken(e.target.value)} 
                placeholder="Enter Bot Token from @BotFather" 
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg text-xs outline-none focus:border-[#0D7043] transition-colors" 
              />
              <button 
                onClick={connectTelegram} 
                disabled={connecting || !botToken.trim()} 
                className="px-4 py-2 bg-[#229ED9] hover:bg-[#1b8ec5] text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-colors shrink-0 shadow-xs"
              >
                {connecting ? 'Verifying...' : 'Connect'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xs border overflow-hidden transition-all duration-200 ${igStatus.connected ? 'border-pink-200 dark:border-pink-900/40' : 'border-gray-200 dark:border-gray-700/60'}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0 border border-[#E1306C]/20">
            <SiInstagram size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Instagram</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Connect your Instagram Business account to automate DMs, product inquiries, and checkouts.</p>
          </div>
        </div>

        <div className="mt-5">
          {loadingIG ? (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-4 justify-center">
              <Loader2 size={15} className="animate-spin text-[#E1306C]" /> Checking status...
            </div>
          ) : igStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200/80 dark:border-pink-800/40 rounded-lg p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-pink-100 dark:bg-pink-900/40 rounded-md text-[#E1306C]">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-pink-900 dark:text-pink-200 text-xs">Instagram is active</p>
                      {igStatus.pageId && <p className="text-[11px] text-pink-700 dark:text-pink-400 mt-0.5">Account ID: {igStatus.pageId}</p>}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-pink-700 dark:text-pink-300 bg-pink-100/70 dark:bg-pink-900/40 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> Connected
                  </span>
                </div>
              </div>
              <button onClick={disconnectInstagram} disabled={disconnectingIG} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-200/60 disabled:opacity-50">
                {disconnectingIG ? 'Disconnecting...' : 'Disconnect Instagram'}
              </button>
            </div>
          ) : (
            <div>
              {connectingIG ? (
                <div className="flex items-center gap-2 text-[#E1306C] text-xs py-3 justify-center font-medium">
                  <Loader2 size={15} className="animate-spin text-[#E1306C]" /> Authenticating with Facebook...
                </div>
              ) : (
                <button 
                  onClick={connectInstagram} 
                  className="w-full sm:w-auto px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <SiInstagram size={14} />
                  <span>Connect with Facebook</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFacebook = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xs border overflow-hidden transition-all duration-200 ${fbStatus.connected ? 'border-blue-200 dark:border-blue-900/40' : 'border-gray-200 dark:border-gray-700/60'}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0084FF]/10 text-[#0084FF] flex items-center justify-center shrink-0 border border-[#0084FF]/20">
            <SiMessenger size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Facebook Messenger</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Connect your Facebook Business Page to handle customer messages directly from Messenger.</p>
          </div>
        </div>

        <div className="mt-5">
          {loadingFB ? (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-4 justify-center">
              <Loader2 size={15} className="animate-spin text-[#0084FF]" /> Checking status...
            </div>
          ) : fbStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 rounded-lg p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-md text-[#0084FF]">
                      <Wifi size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-200 text-xs">Facebook Messenger is active</p>
                      {fbStatus.pageId && <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">Page ID: {fbStatus.pageId}</p>}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Connected
                  </span>
                </div>
              </div>
              <button onClick={disconnectFacebook} disabled={disconnectingFB} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-200/60 disabled:opacity-50">
                {disconnectingFB ? 'Disconnecting...' : 'Disconnect Facebook'}
              </button>
            </div>
          ) : (
            <div>
              {connectingFB ? (
                <div className="flex items-center gap-2 text-[#0084FF] text-xs py-3 justify-center font-medium">
                  <Loader2 size={15} className="animate-spin text-[#0084FF]" /> Authenticating connection...
                </div>
              ) : (
                <button 
                  onClick={connectFacebook} 
                  className="w-full sm:w-auto px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <SiMessenger size={14} />
                  <span>Connect with Facebook</span>
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
    <div className="space-y-6 pb-12">
      {/* Global Kasi AI status banner */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700/60 p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${isAutomated ? 'bg-emerald-50 text-[#0D7043] border border-emerald-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'}`}>
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Kasi AI Automation
              <span className={`inline-flex items-center w-2 h-2 rounded-full ${isAutomated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isAutomated 
                ? "Kasi is actively handling customer conversations and orders across all channels." 
                : "Kasi is currently paused. Customers will not receive automated responses."}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleAutomated}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAutomated ? 'bg-[#0D7043]' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${isAutomated ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderWhatsApp()}
        {renderTelegram()}
        {renderInstagram()}
        {renderFacebook()}
      </div>
    </div>
  );
};

export default IntegrationsTab;
