import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi } from '../api/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('finforge_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('finforge_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshProfile = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const login = async (token: string, userData: User) => {
    localStorage.setItem('finforge_token', token);
    setUser(userData);
    // Immediately fetch full profile after login to ensure all database fields are present
    await refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('finforge_token');
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
