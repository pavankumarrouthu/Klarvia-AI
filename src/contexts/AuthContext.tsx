import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Minimal User shape used in this app
type User = { id: string; email: string } | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Base URL for API (defaults to backend dev API on port 5000)
  const API_BASE = (import.meta.env.VITE_API_BASE ?? '') || 'http://localhost:5000';

    // Check current session/user from our backend
    fetch(API_BASE + '/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    // No realtime auth state from backend; rely on app actions to update state
    return () => {};
  }, []);

  const signup = async (email: string, password: string) => {
  const API_BASE = (import.meta.env.VITE_API_BASE ?? '') || 'http://localhost:5000';
    const res = await fetch(API_BASE + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Signup failed');
    }
    // Do not auto-set user; backend requires explicit login now
    await res.json();
  };

  const login = async (email: string, password: string) => {
  const API_BASE = (import.meta.env.VITE_API_BASE ?? '') || 'http://localhost:5000';
    const res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Login failed');
    }
    const body = await res.json();
    setUser(body.user ?? null);
  };

  const logout = async () => {
    const API_BASE = (import.meta.env.VITE_API_BASE ?? '') || 'http://localhost:8080';
    await fetch(API_BASE + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
