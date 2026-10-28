import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage token on load
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('clf_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('clf_token');
          setUser(null);
        }
      } catch {
        localStorage.removeItem('clf_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user: userData } = res.data;
    if (token) {
      localStorage.setItem('clf_token', token);
      setUser(userData);
    }
    return userData;
  }, []);

  const register = useCallback(async (userData) => {
    // Sends registration data (name, prn, email, password) to backend
    // User is NOT automatically logged in - redirected to Login page per requirements
    const res = await authApi.register(userData);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('clf_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
