import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data;
      
      if (data.requires_2fa) {
        return { requires_2fa: true, temp_token: data.temp_token };
      }
      
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } catch (error) {
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
      
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Google authentication failed';
      throw new Error(message);
    }
  };

  const verify2Fa = async (temp_token, code) => {
    try {
      const res = await api.post('/api/auth/login/verify-2fa', { temp_token, code });
      const data = res.data;
      
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
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

  const resetPassword = async (token, password) => {
    try {
      const res = await api.post('/api/auth/reset-password', { token, password });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, loginWithGoogle, verify2Fa, forgotPassword, resetPassword, logout, loading, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
