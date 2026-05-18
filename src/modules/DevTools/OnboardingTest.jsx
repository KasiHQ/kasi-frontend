import React, { useState, useEffect } from 'react';
import { onboardingAPI } from '../../api/onboarding';
import { conversationAPI } from '../../api/conversations';

const OnboardingTest = () => {
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testOnboardingAPI = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await onboardingAPI.getStatus();
      setOnboardingStatus(response.data);
    } catch (err) {
      setError(`Onboarding API Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConversationAPI = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await conversationAPI.getPipeline();
      setPipeline(response.data);
    } catch (err) {
      setError(`Conversation API Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPaystackConnection = async () => {
    setLoading(true);
    setError('');
    
    try {
      await onboardingAPI.connectPaystack({
        authorization_code: 'test_auth_code',
        subaccount_id: 'test_subaccount_id',
        subaccount_code: 'test_subaccount_code'
      });
      setError('Paystack connection test successful!');
      testOnboardingAPI(); // Refresh status
    } catch (err) {
      setError(`Paystack API Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testOnboardingAPI();
    testConversationAPI();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Testing Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Onboarding Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Onboarding Status</h2>
            <button
              onClick={testOnboardingAPI}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
          
          {onboardingStatus ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Paystack Connected:</span>
                <span className={onboardingStatus.paystack_connected ? 'text-green-600' : 'text-red-600'}>
                  {onboardingStatus.paystack_connected ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>WhatsApp Connected:</span>
                <span className={onboardingStatus.whatsapp_connected ? 'text-green-600' : 'text-red-600'}>
                  {onboardingStatus.whatsapp_connected ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Instagram Connected:</span>
                <span className={onboardingStatus.instagram_connected ? 'text-green-600' : 'text-red-600'}>
                  {onboardingStatus.instagram_connected ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Store Address Added:</span>
                <span className={onboardingStatus.store_address_added ? 'text-green-600' : 'text-red-600'}>
                  {onboardingStatus.store_address_added ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Completed:</span>
                <span className={onboardingStatus.completed ? 'text-green-600' : 'text-red-600'}>
                  {onboardingStatus.completed ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <button
              onClick={testPaystackConnection}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Paystack Connection
            </button>
          </div>
        </div>

        {/* Conversation Pipeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversation Pipeline</h2>
            <button
              onClick={testConversationAPI}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
          
          {pipeline ? (
            <div className="space-y-2">
              {Object.entries(pipeline).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{status}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{Object.values(pipeline).reduce((sum, count) => sum + count, 0)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </div>

      {/* Raw Data */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Raw API Responses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Onboarding Status:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(onboardingStatus, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Pipeline Data:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(pipeline, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Available API Endpoints</h2>
        
        <div className="space-y-2 text-sm">
          <div><strong>Onboarding:</strong></div>
          <ul className="ml-4 space-y-1 text-gray-600">
            <li>GET /api/onboarding/status</li>
            <li>POST /api/onboarding/paystack/connect</li>
            <li>POST /api/onboarding/whatsapp/connect</li>
            <li>POST /api/onboarding/instagram/connect</li>
            <li>POST /api/onboarding/store-address</li>
            <li>POST /api/onboarding/complete</li>
          </ul>
          
          <div className="pt-2"><strong>Conversations:</strong></div>
          <ul className="ml-4 space-y-1 text-gray-600">
            <li>GET /api/conversations</li>
            <li>GET /api/conversations/:id</li>
            <li>PATCH /api/conversations/:id/status</li>
            <li>POST /api/conversations/bulk-update</li>
            <li>GET /api/conversations/pipeline</li>
            <li>GET /api/conversations/:id/summary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTest;