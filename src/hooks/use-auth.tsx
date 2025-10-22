"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { User, Role } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Check for saved user in localStorage to persist session
    const savedUser = localStorage.getItem('healthconnect-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (role: Role) => {
    // Find the first user with the selected role for this mock implementation
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      localStorage.setItem('healthconnect-user', JSON.stringify(userToLogin));
      setUser(userToLogin);
    }
  };

  const logout = () => {
    localStorage.removeItem('healthconnect-user');
    setUser(null);
  };
  
  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
