import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  // On mount, try to restore session from the HttpOnly cookie
  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  // Listen for auth-logout events fired by the axios interceptor when refresh fails
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data;
      
      if (data.requires_2fa) {
        return { requires_2fa: true, temp_token: data.temp_token };
      }
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error.response?.data?.email_unverified) {
        const customErr = new Error(error.response.data.message || 'Email not verified');
        customErr.email_unverified = true;
        customErr.email = error.response.data.email || email;
        throw customErr;
      }
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (businessName, email, password, businessType) => {
    try {
      const res = await api.post('/api/auth/register', { 
        business_name: businessName, 
        email, 
        password,
        business_type: businessType
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const loginWithGoogle = async (credential, businessType = null) => {
    try {
      const res = await api.post('/api/auth/google', { credential, business_type: businessType });
      const data = res.data;
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Google authentication failed';
      throw new Error(message);
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      const res = await api.post('/api/auth/verify-email', { email, code });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed';
      throw new Error(message);
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const res = await api.post('/api/auth/resend-verification', { email });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend code';
      throw new Error(message);
    }
  };

  const verify2Fa = async (temp_token, code) => {
    try {
      const res = await api.post('/api/auth/login/verify-2fa', { temp_token, code });
      const data = res.data;
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || '2FA Verification failed';
      throw new Error(message);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      throw new Error(message);
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const res = await api.post('/api/auth/reset-password', { token: resetToken, password });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Even if the server call fails, clear client-side state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, verifyEmail, resendVerificationCode, verify2Fa, forgotPassword, resetPassword, logout, loading, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
