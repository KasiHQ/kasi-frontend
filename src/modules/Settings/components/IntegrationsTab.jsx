import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Instagram, CheckCircle, XCircle,
  ExternalLink, Copy, Loader2, Wifi, WifiOff, RefreshCw, LogOut, Zap, Facebook
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import useNetwork from '../../../hooks/useNetwork';

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
  const [disconnectingWA, setDisconnectingWA] = useState(false);
  const [waStatus, setWaStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingWA, setLoadingWA] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Instagram state
  const [igUsername, setIgUsername] = useState('');
  const [connectingIG, setConnectingIG] = useState(false);
  const [disconnectingIG, setDisconnectingIG] = useState(false);
  const [igStatus, setIgStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingIG, setLoadingIG] = useState(true);

  // Facebook state
  const [fbPage, setFbPage] = useState('');
  const [connectingFB, setConnectingFB] = useState(false);
  const [disconnectingFB, setDisconnectingFB] = useState(false);
  const [fbStatus, setFbStatus] = useState({ connected: false, status: 'disconnected' });
  const [loadingFB, setLoadingFB] = useState(true);

  const pairingCodeRef = useRef(pairingCode);
  pairingCodeRef.current = pairingCode;

  useEffect(() => {
    fetchTelegramStatus();
    fetchWhatsAppStatus();
    fetchInstagramStatus();
    fetchFacebookStatus();

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
    } catch { } finally { setLoadingStatus(false); }
  };

  const fetchWhatsAppStatus = async () => {
    try {
      const res = await api.get('/api/whatsapp/status');
      setWaStatus(res.data);
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
        status: instagramIntegration?.connection_status || 'disconnected'
      });
    } catch {
      setIgStatus({ connected: false, status: 'disconnected' });
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
        status: facebookIntegration?.connection_status || 'disconnected'
      });
    } catch {
      setFbStatus({ connected: false, status: 'disconnected' });
    } finally { setLoadingFB(false); }
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

  const connectInstagram = async () => {
    if (!igUsername.trim()) { addToast('Please enter your Instagram username', 'error'); return; }
    setConnectingIG(true);
    try {
      await api.post('/api/whatsapp/instagram/connect', { instagram_username: igUsername.trim() });
      setIgStatus({ connected: true, status: 'In Progress' });
      setIgUsername('');
      addToast('Instagram instance created!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to connect', 'error');
    } finally { setConnectingIG(false); }
  };

  const disconnectInstagram = async () => {
    if (!confirm('Disconnect Instagram?')) return;
    setDisconnectingIG(true);
    try {
      await api.post('/api/whatsapp/disconnect');
      setIgStatus({ connected: false, status: 'disconnected' });
      addToast('Instagram disconnected', 'success');
    } catch { addToast('Failed to disconnect', 'error'); } finally { setDisconnectingIG(false); }
  };

  const connectFacebook = async () => {
    if (!fbPage.trim()) { addToast('Please enter your Facebook page name', 'error'); return; }
    setConnectingFB(true);
    try {
      await api.post('/api/whatsapp/facebook/connect', { facebook_page: fbPage.trim() });
      setFbStatus({ connected: true, status: 'In Progress' });
      setFbPage('');
      addToast('Facebook instance created!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to connect', 'error');
    } finally { setConnectingFB(false); }
  };

  const disconnectFacebook = async () => {
    if (!confirm('Disconnect Facebook?')) return;
    setDisconnectingFB(true);
    try {
      await api.post('/api/whatsapp/disconnect');
      setFbStatus({ connected: false, status: 'disconnected' });
      addToast('Facebook disconnected', 'success');
    } catch { addToast('Failed to disconnect', 'error'); } finally { setDisconnectingFB(false); }
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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${waStatus.connected ? 'bg-green-500' : 'bg-green-500/80'}`}>
              <MessageCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-dark dark:text-white">WhatsApp Business</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Link your WhatsApp account to auto-respond to customer messages.</p>
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-700 dark:text-green-400"><Wifi size={18} /></div>
                  <p className="font-bold text-green-800 dark:text-green-300 text-sm">WhatsApp is live!</p>
                </div>
              </div>
              <button onClick={() => setShowDisconnectConfirm(true)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                Disconnect WhatsApp
              </button>
              {showDisconnectConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3 mt-2">
                  <p className="text-sm font-semibold text-red-800">Are you sure?</p>
                  <div className="flex gap-2">
                    <button onClick={disconnectWhatsApp} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Yes, Disconnect</button>
                    <button onClick={() => setShowDisconnectConfirm(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pairingCode ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter this code in WhatsApp Linked Devices:</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-2xl font-bold tracking-widest">{codeA}</div>
                    <span className="text-gray-400">—</span>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-2xl font-bold tracking-widest">{codeB}</div>
                  </div>
                  <button onClick={() => { setPairingCode(''); setWaPhoneNumber(''); }} className="text-xs text-gray-500 hover:underline">Start over</button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="tel" value={waPhoneNumber} onChange={(e) => setWaPhoneNumber(e.target.value)} placeholder="Phone number (e.g. 2348031234567)" className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl text-sm outline-none focus:border-primary" />
                  <button onClick={connectWhatsApp} disabled={connectingWA || !waPhoneNumber.trim()} className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                    {connectingWA ? 'Generating...' : 'Get Code'}
                  </button>
                </div>
              )}
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
                  <p className="font-bold text-pink-800 dark:text-pink-300 text-sm">Instagram Connected!</p>
                </div>
              </div>
              <button onClick={disconnectInstagram} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                Disconnect Instagram
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={igUsername} onChange={(e) => setIgUsername(e.target.value)} placeholder="Instagram username" className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl text-sm outline-none focus:border-primary" />
              <button onClick={connectInstagram} disabled={connectingIG || !igUsername.trim()} className="px-6 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 disabled:opacity-50">
                {connectingIG ? 'Connecting...' : 'Connect'}
              </button>
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
                  <p className="font-bold text-blue-800 dark:text-blue-300 text-sm">Facebook Connected!</p>
                </div>
              </div>
              <button onClick={disconnectFacebook} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                Disconnect Facebook
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={fbPage} onChange={(e) => setFbPage(e.target.value)} placeholder="Facebook Page name" className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl text-sm outline-none focus:border-primary" />
              <button onClick={connectFacebook} disabled={connectingFB || !fbPage.trim()} className="px-6 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-50">
                {connectingFB ? 'Connecting...' : 'Connect'}
              </button>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {renderWhatsApp()}
      {renderTelegram()}
      {renderInstagram()}
      {renderFacebook()}
    </div>
  );
};

export default IntegrationsTab;
