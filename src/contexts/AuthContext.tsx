import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = { id: string; email: string | null } | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const BASE = import.meta.env.VITE_BACKEND_URL ?? '/api';

  useEffect(() => {
    // Load token and fetch current user
    const token = localStorage.getItem('auth_token');
    if (!token) { setUser(null); setLoading(false); return; }
    fetch(BASE + '/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async (r) => {
      if (!r.ok) { setUser(null); return; }
      const data = await r.json();
      // backend returns { user: { id, email, name, created_at } }
      setUser(data.user ?? null);
    }).finally(() => setLoading(false));
  }, [BASE]);

  const signup = async (email: string, password: string, name?: string) => {
    const res = await fetch(BASE + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
    }
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Login failed');
    }
    const { token, user } = data;
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
