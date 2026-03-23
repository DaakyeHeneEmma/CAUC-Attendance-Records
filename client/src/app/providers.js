'use client';

import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

const SESSION_KEY = 'cauc_session';

const getSession = () => {
  if (typeof sessionStorage === 'undefined') return null;
  const session = sessionStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const setSession = (data) => {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

const clearSession = () => {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isLoggedIn = useRef(false);

  useEffect(() => {
    const session = getSession();
    if (session?.token && session?.user) {
      setUser(session.user);
      axios.defaults.headers.common['x-auth-token'] = session.token;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === SESSION_KEY && e.newValue === null) {
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
        router.push('/login');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [router]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const sessionData = {
        token: res.data.token,
        user: res.data.user
      };
      setSession(sessionData);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      isLoggedIn.current = true;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post('/api/auth/register', data);
      const sessionData = {
        token: res.data.token,
        user: res.data.user
      };
      setSession(sessionData);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      isLoggedIn.current = true;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    clearSession();
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    isLoggedIn.current = false;
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
