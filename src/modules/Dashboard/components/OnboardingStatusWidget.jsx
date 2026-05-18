import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, Settings } from 'lucide-react';
import { onboardingAPI } from '../../../api/onboarding';

const OnboardingStatusWidget = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    {
      id: 'paystack_connected',
      title: 'Paystack Account',
      description: 'Payment processing',
      required: true
    },
    {
      id: 'whatsapp_connected',
      title: 'WhatsApp Business',
      description: 'Customer messaging',
      required: true
    },
    {
      id: 'instagram_connected',
      title: 'Instagram',
      description: 'Social media DMs',
      required: false
    },
    {
      id: 'store_address_added',
      title: 'Store Location',
      description: 'Physical address',
      required: false
    }
  ];

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await onboardingAPI.getStatus();
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  const completedSteps = steps.filter(step => progress[step.id]).length;
  const requiredSteps = steps.filter(step => step.required);
  const completedRequiredSteps = requiredSteps.filter(step => progress[step.id]).length;
  const isOnboardingComplete = progress.completed;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Setup Progress
          </h3>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Settings className="w-4 h-4 mr-1" />
            Manage
          </button>
        </div>

        {isOnboardingComplete ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Setup Complete!</p>
            <p className="text-sm text-gray-600">Your Kasi AI is ready to go</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{completedSteps}/{steps.length} steps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Required Steps Status */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Required steps: {completedRequiredSteps}/{requiredSteps.length}
              </p>
              
              {completedRequiredSteps < requiredSteps.length && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-yellow-800 text-sm">
                    Complete required steps to activate your Kasi AI
                  </p>
                </div>
              )}
            </div>

            {/* Steps List */}
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  {progress[step.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      progress[step.id] ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {step.title}
                      {step.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingStatusWidget;