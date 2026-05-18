import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Instagram, CheckCircle, XCircle,
  ExternalLink, Copy, Loader2, Wifi, WifiOff, RefreshCw, LogOut, Zap
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import WebhookSimulator from '../../DevTools/WebhookSimulator';
import useNetwork from '../../../hooks/useNetwork';

const Integrations = () => {
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
  const [disconnectingWA, setDisconnectingWA] = useState(false);
  const [waStatus, setWaStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingWA, setLoadingWA] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Instagram state (Direct Meta API)
  const [igPageId, setIgPageId] = useState('');
  const [igAccessToken, setIgAccessToken] = useState('');
  const [connectingIG, setConnectingIG] = useState(false);
  const [igStatus, setIgStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingIG, setLoadingIG] = useState(true);

  // Facebook state (Direct Meta API)
  const [fbPageId, setFbPageId] = useState('');
  const [fbAccessToken, setFbAccessToken] = useState('');
  const [connectingFB, setConnectingFB] = useState(false);
  const [fbStatus, setFbStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingFB, setLoadingFB] = useState(true);

  // Constants for Meta Setup
  const META_VERIFY_TOKEN = 'kasi_ai_meta_verify_token_2026';
  const WEBHOOK_URL = `https://checkless-tabitha-isagogically.ngrok-free.dev/api/meta/webhook`;

  const pairingCodeRef = useRef(pairingCode);
  pairingCodeRef.current = pairingCode;

  useEffect(() => {
    fetchTelegramStatus();
    fetchWhatsAppStatus();
    fetchInstagramStatus();
    fetchFacebookStatus();

    // Poll WhatsApp status every 5s while pending or disconnected
    const interval = setInterval(() => {
      if (!waStatus.connected) {
        fetchWhatsAppStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [waStatus.connected]);

  const fetchTelegramStatus = async () => {
    try {
      if (!isOnline) { setLoadingStatus(false); return; }
      const res = await api.get('/api/telegram/status');
      setTelegramStatus(res.data);
    } catch {
      // silent
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchWhatsAppStatus = async () => {
    try {
      const res = await api.get('/api/whatsapp/status');
      setWaStatus(res.data);
      // Auto-clear pairing code on successful connect
      if (res.data.connected && pairingCodeRef.current) {
        setPairingCode('');
        addToast('WhatsApp connected successfully!', 'success');
      }
    } catch {
      // silent
    } finally {
      setLoadingWA(false);
    }
  };

  const fetchInstagramStatus = async () => {
    try {
      if (!isOnline) { setLoadingIG(false); return; }
      const res = await api.get('/api/whatsapp/status');
      const integrations = res.data.integrations || [];
      const instagramIntegration = integrations.find(int => int.platform === 'instagram');
      setIgStatus({ 
        connected: instagramIntegration?.connection_status === 'connected' && instagramIntegration?.instance_name,
        status: instagramIntegration?.connection_status || 'disconnected'
      });
    } catch {
      setIgStatus({ connected: false, status: 'disconnected' });
    } finally {
      setLoadingIG(false);
    }
  };

  const fetchFacebookStatus = async () => {
    try {
      if (!isOnline) { setLoadingFB(false); return; }
      const res = await api.get('/api/whatsapp/status');
      const integrations = res.data.integrations || [];
      const facebookIntegration = integrations.find(int => int.platform === 'facebook');
      setFbStatus({ 
        connected: facebookIntegration?.connection_status === 'connected' && facebookIntegration?.instance_name,
        status: facebookIntegration?.connection_status || 'disconnected'
      });
    } catch {
      setFbStatus({ connected: false, status: 'disconnected' });
    } finally {
      setLoadingFB(false);
    }
  };

  // ── Telegram ─────────────────────────────────────
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
    } finally {
      setConnecting(false);
    }
  };

  const disconnectTelegram = async () => {
    if (!confirm('Disconnect your Telegram bot?')) return;
    try {
      await api.delete('/api/telegram/disconnect');
      setTelegramStatus({ connected: false, bot: null });
      addToast('Bot disconnected', 'success');
    } catch {
      addToast('Failed to disconnect', 'error');
    }
  };

  // ── WhatsApp ──────────────────────────────────────
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
      } else {
        addToast("No code returned — check backend terminal.", 'warning');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to generate code', 'error');
    } finally {
      setConnectingWA(false);
    }
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
    } finally {
      setDisconnectingWA(false);
    }
  };

  const copyPairingCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode);
    setCodeCopied(true);
    addToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // ── Instagram (Direct Meta API) ──────────────────
  const connectInstagram = async () => {
    if (!igPageId.trim() || !igAccessToken.trim()) { 
      addToast('Page ID and Access Token are required', 'error'); 
      return; 
    }
    setConnectingIG(true);
    try {
      await api.post('/api/meta/connect', { 
        platform: 'instagram', 
        page_id: igPageId.trim(),
        access_token: igAccessToken.trim()
      });
      setIgStatus({ connected: true, status: 'connected' });
      setIgPageId('');
      setIgAccessToken('');
      addToast('Instagram connected via Direct Meta API!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to connect Instagram', 'error');
    } finally {
      setConnectingIG(false);
    }
  };

  const disconnectInstagram = async () => {
    if (!confirm('Disconnect Instagram?')) return;
    try {
      await api.post('/api/whatsapp/disconnect', { platform: 'instagram' });
      setIgStatus({ connected: false, status: 'disconnected' });
      addToast('Instagram disconnected', 'success');
    } catch {
      addToast('Failed to disconnect', 'error');
    }
  };

  // ── Facebook (Direct Meta API) ───────────────────
  const connectFacebook = async () => {
    if (!fbPageId.trim() || !fbAccessToken.trim()) { 
      addToast('Page ID and Access Token are required', 'error'); 
      return; 
    }
    setConnectingFB(true);
    try {
      await api.post('/api/meta/connect', { 
        platform: 'facebook', 
        page_id: fbPageId.trim(),
        access_token: fbAccessToken.trim()
      });
      setFbStatus({ connected: true, status: 'connected' });
      setFbPageId('');
      setFbAccessToken('');
      addToast('Facebook connected via Direct Meta API!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to connect Facebook', 'error');
    } finally {
      setConnectingFB(false);
    }
  };

  const disconnectFacebook = async () => {
    if (!confirm('Disconnect Facebook?')) return;
    try {
      await api.post('/api/whatsapp/disconnect', { platform: 'facebook' });
      setFbStatus({ connected: false, status: 'disconnected' });
      addToast('Facebook disconnected', 'success');
    } catch {
      addToast('Failed to disconnect', 'error');
    }
  };

  // Split pairing code into two 4-char groups for display
  const formatCode = (code) => {
    if (!code) return ['', ''];
    const clean = code.replace(/[-\s]/g, '');
    return [clean.slice(0, 4), clean.slice(4, 8)];
  };

  const [codeA, codeB] = formatCode(pairingCode);

  return (
    <div className="space-y-6">

      {!isOnline && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center shadow-sm border border-yellow-200">
          Integrations are unavailable in Offline Mode.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-dark mb-1">Integrations</h1>
        <p className="text-gray-500 text-sm">Connect messaging platforms so Kasi AI can respond to your customers automatically.</p>
      </div>

      {/* ── Telegram ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <Send size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-dark">Telegram</h3>
                {telegramStatus.connected ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} /> Connected
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                    <XCircle size={12} /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Connect a Telegram bot to auto-respond to customer messages, share product catalogs, and generate invoices.
              </p>
            </div>
          </div>

          {loadingStatus ? (
            <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin" /> Checking status...
            </div>
          ) : telegramStatus.connected ? (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-700"><Send size={18} /></div>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">@{telegramStatus.bot?.bot_username || 'your-bot'} is live!</p>
                    <p className="text-xs text-green-700 mt-0.5">Customers messaging your bot will get AI-powered responses.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={disconnectTelegram}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
              >
                Disconnect Bot
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-dark">Setup Guide (2 minutes)</p>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Open Telegram and search for <strong>@BotFather</strong></li>
                  <li>Send <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">/newbot</code> and follow the prompts</li>
                  <li>BotFather will give you a <strong>bot token</strong> — copy it</li>
                  <li>Paste the token below and click <strong>Connect</strong></li>
                </ol>
                <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <ExternalLink size={14} /> Open @BotFather
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)}
                  placeholder="Paste your bot token here (e.g. 123456:ABC-DEF1234...)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button onClick={connectTelegram} disabled={connecting || !botToken.trim()}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 justify-center whitespace-nowrap">
                  {connecting ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Connect Bot'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── WhatsApp ─────────────────────────────────── */}
      <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
        waStatus.connected ? 'border-green-200' : 'border-gray-100'
      }`}>
        {/* Header */}
        <div className={`p-5 sm:p-6 ${waStatus.connected ? 'border-b border-green-100' : ''}`}>
          <div className="flex items-start gap-4">
            {/* Icon with pulse when connected */}
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                waStatus.connected ? 'bg-green-500' : 'bg-green-500/80'
              }`}>
                <MessageCircle size={24} className="text-white" />
              </div>
              {waStatus.connected && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-dark">WhatsApp</h3>

                {loadingWA ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-400 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Checking...
                  </span>
                ) : waStatus.connected ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Connected
                  </span>
                ) : waStatus.status === 'pending' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Pairing...
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                    <WifiOff size={11} /> Not Connected
                  </span>
                )}

                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                  <Zap size={11} /> Kasi Engine
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Link your WhatsApp account using your phone number. Kasi AI will reply to your customer messages automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Body — switches between states */}
        <div className="p-5 sm:p-6">
          {loadingWA ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking connection status...
            </div>

          ) : waStatus.connected ? (
            /* ── CONNECTED STATE ── */
            <div className="space-y-4">
              {/* Status card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                    <Wifi size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">WhatsApp is live!</p>
                    <p className="text-xs text-green-600">Kasi AI is actively responding to your customers</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-green-700">AI</div>
                    <div className="text-xs text-gray-500 mt-0.5">Auto-Replies On</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-green-700">24/7</div>
                    <div className="text-xs text-gray-500 mt-0.5">Always Responding</div>
                  </div>
                </div>
              </div>

              {/* Disconnect button or confirm dialog */}
              {showDisconnectConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-red-800">Disconnect WhatsApp?</p>
                  <p className="text-xs text-red-600">
                    Kasi AI will stop responding to your customers on WhatsApp. You can reconnect anytime.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={disconnectWhatsApp}
                      disabled={disconnectingWA}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                      {disconnectingWA
                        ? <><Loader2 size={14} className="animate-spin" /> Disconnecting...</>
                        : <><LogOut size={14} /> Yes, Disconnect</>}
                    </button>
                    <button
                      onClick={() => setShowDisconnectConfirm(false)}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  Disconnect WhatsApp
                </button>
              )}
            </div>

          ) : (
            /* ── SETUP / RECONNECT STATE ── */
            <div className="space-y-5">
              {!pairingCode ? (
                <>
                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-dark flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">?</span>
                      How to Connect via Phone Number
                    </p>
                    <ol className="text-sm text-gray-600 space-y-2 list-none pl-0">
                      {[
                        'Enter your WhatsApp phone number below (e.g. 2348031234567)',
                        <>Click <strong>Generate Pairing Code</strong></>,
                        <>On your phone: WhatsApp → Settings → <strong>Linked Devices</strong></>,
                        <>Tap <strong>Link a Device</strong> → <strong>Link with phone number instead</strong></>,
                        'Enter the 8-character code displayed here',
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Phone input + button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="wa-phone-input"
                      type="tel"
                      value={waPhoneNumber}
                      onChange={(e) => setWaPhoneNumber(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && connectWhatsApp()}
                      placeholder="Phone number (e.g. 2348031234567)"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition-all"
                    />
                    <button
                      id="wa-generate-btn"
                      onClick={connectWhatsApp}
                      disabled={connectingWA || !waPhoneNumber.trim()}
                      className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 justify-center whitespace-nowrap shadow-sm shadow-green-200"
                    >
                      {connectingWA
                        ? <><Loader2 size={15} className="animate-spin" /> Generating...</>
                        : <><Wifi size={15} /> Generate Pairing Code</>}
                    </button>
                  </div>
                </>
              ) : (
                /* ── PAIRING CODE DISPLAY ── */
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">Your Pairing Code</p>
                      <p className="text-sm text-green-700">Enter this in WhatsApp within 2 minutes</p>
                    </div>

                    {/* Code display — split into two groups */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-white border-2 border-green-400 rounded-xl px-5 py-3 shadow-sm shadow-green-100">
                        <span className="text-3xl font-black tracking-[0.2em] text-dark font-mono">{codeA}</span>
                      </div>
                      <span className="text-2xl font-black text-green-400">—</span>
                      <div className="bg-white border-2 border-green-400 rounded-xl px-5 py-3 shadow-sm shadow-green-100">
                        <span className="text-3xl font-black tracking-[0.2em] text-dark font-mono">{codeB}</span>
                      </div>
                      <button
                        onClick={copyPairingCode}
                        className={`p-2.5 rounded-xl border transition-all ${codeCopied
                          ? 'bg-green-100 border-green-300 text-green-600'
                          : 'bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600'}`}
                        title="Copy code"
                      >
                        {codeCopied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <p className="text-xs text-green-600 max-w-xs mx-auto">
                      WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number instead
                    </p>

                    {/* Countdown hint */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mx-auto w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Code expires in ~2 minutes
                    </div>
                  </div>

                  <button
                    onClick={() => { setPairingCode(''); setWaPhoneNumber(''); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                  >
                    <RefreshCw size={13} /> Start over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Instagram ─────────────────────────────────── */}
      <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
        igStatus.connected ? 'border-pink-200' : 'border-gray-100'
      }`}>
        <div className={`p-5 sm:p-6 ${igStatus.connected ? 'border-b border-pink-100' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                igStatus.connected ? 'bg-pink-500' : 'bg-pink-500/80'
              }`}>
                <Instagram size={24} className="text-white" />
              </div>
              {igStatus.connected && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-400 border-2 border-white rounded-full">
                  <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-75" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-dark">Instagram</h3>
                {loadingIG ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-400 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Checking...
                  </span>
                ) : igStatus.connected ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse inline-block" />
                    Connected
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                    <WifiOff size={11} /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Turn Instagram DMs into sales with AI-powered auto-responses.</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loadingIG ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking connection status...
            </div>
          ) : igStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center">
                    <Instagram size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-pink-800 text-sm">Instagram is live!</p>
                    <p className="text-xs text-pink-600">Kasi AI is responding to your Instagram DMs</p>
                  </div>
                </div>
              </div>
              <button
                onClick={disconnectInstagram}
                disabled={disconnectingIG}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-medium transition-all duration-200 group disabled:opacity-60"
              >
                {disconnectingIG ? <><Loader2 size={15} className="animate-spin" /> Disconnecting...</> : <><LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" /> Disconnect Instagram</>}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-dark flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">?</span>
                  How to Connect Instagram (Direct Meta API)
                </p>
                <ol className="text-sm text-gray-600 space-y-3 list-none pl-0">
                  <li className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <p>Create a Meta App and add <strong>Instagram Graph API</strong>.</p>
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Callback URL</span>
                          <code className="text-pink-600 font-mono font-bold select-all">{WEBHOOK_URL}</code>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Verify Token</span>
                          <code className="text-pink-600 font-mono font-bold select-all">{META_VERIFY_TOKEN}</code>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Generate a <strong>Permanent Page Access Token</strong> and get your <strong>Page ID</strong>.</span>
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Instagram Page ID</label>
                  <input
                    type="text"
                    value={igPageId}
                    onChange={(e) => setIgPageId(e.target.value)}
                    placeholder="Enter Page ID"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Access Token</label>
                  <input
                    type="password"
                    value={igAccessToken}
                    onChange={(e) => setIgAccessToken(e.target.value)}
                    placeholder="EAA..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all"
                  />
                </div>
              </div>
              
              <button
                onClick={connectInstagram}
                disabled={connectingIG || !igPageId || !igAccessToken}
                className="w-full sm:w-auto px-6 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 justify-center whitespace-nowrap shadow-sm shadow-pink-200"
              >
                {connectingIG ? <><Loader2 size={15} className="animate-spin" /> Connecting...</> : <><Instagram size={15} /> Connect Instagram</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Facebook ─────────────────────────────────── */}
      <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${
        fbStatus.connected ? 'border-blue-200' : 'border-gray-100'
      }`}>
        <div className={`p-5 sm:p-6 ${fbStatus.connected ? 'border-b border-blue-100' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                fbStatus.connected ? 'bg-blue-600' : 'bg-blue-600/80'
              }`}>
                <Send size={24} className="text-white" />
              </div>
              {fbStatus.connected && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full">
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-dark">Facebook Messenger</h3>
                {loadingFB ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-400 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Checking...
                  </span>
                ) : fbStatus.connected ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                    Connected
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
                    <WifiOff size={11} /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Auto-respond to Facebook Page messages with AI-powered customer service.</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loadingFB ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
              <Loader2 size={16} className="animate-spin" /> Checking connection status...
            </div>
          ) : fbStatus.connected ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                    <Send size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-800 text-sm">Facebook Messenger is live!</p>
                    <p className="text-xs text-blue-600">Kasi AI is responding to your page messages</p>
                  </div>
                </div>
              </div>
              <button
                onClick={disconnectFacebook}
                disabled={disconnectingFB}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-medium transition-all duration-200 group disabled:opacity-60"
              >
                {disconnectingFB ? <><Loader2 size={15} className="animate-spin" /> Disconnecting...</> : <><LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" /> Disconnect Facebook</>}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-dark flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">?</span>
                  How to Connect Facebook (Direct Meta API)
                </p>
                <ol className="text-sm text-gray-600 space-y-3 list-none pl-0">
                  <li className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <p>Create a Meta App and add <strong>Messenger API</strong>.</p>
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Callback URL</span>
                          <code className="text-blue-600 font-mono font-bold select-all">{WEBHOOK_URL}</code>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Verify Token</span>
                          <code className="text-blue-600 font-mono font-bold select-all">{META_VERIFY_TOKEN}</code>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Generate a <strong>Permanent Page Access Token</strong> and get your <strong>Page ID</strong>.</span>
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Facebook Page ID</label>
                  <input
                    type="text"
                    value={fbPageId}
                    onChange={(e) => setFbPageId(e.target.value)}
                    placeholder="Enter Page ID"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Access Token</label>
                  <input
                    type="password"
                    value={fbAccessToken}
                    onChange={(e) => setFbAccessToken(e.target.value)}
                    placeholder="EAA..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
                  />
                </div>
              </div>
              
              <button
                onClick={connectFacebook}
                disabled={connectingFB || !fbPageId || !fbAccessToken}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 justify-center whitespace-nowrap shadow-sm shadow-blue-200"
              >
                {connectingFB ? <><Loader2 size={15} className="animate-spin" /> Connecting...</> : <><Send size={15} /> Connect Facebook</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Webhook Simulator ──────────────────────── */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-dark mb-4">Message Simulator (DevTool)</h3>
        <WebhookSimulator />
      </div>
    </div>
  );
};

export default Integrations;
