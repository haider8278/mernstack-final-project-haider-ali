import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'lms_token';
const USER_KEY = 'lms_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((userData, token) => {
    if (userData && token) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userData);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    persistAuth(data.user, data.token);
    return data;
  }, [persistAuth]);

  const register = useCallback(async (name, email, password) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    persistAuth(data.user, data.token);
    return data;
  }, [persistAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) setUser(null);
      else {
        try {
          const u = localStorage.getItem(USER_KEY);
          if (u) setUser(JSON.parse(u));
        } catch (e) {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
