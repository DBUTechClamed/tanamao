
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextProps {
  currentUser: UserProfile | null;
  login: (role: UserRole, userId: string) => void;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
  loading: boolean;
  getUserById: (id: string) => UserProfile | undefined;
  getUsersByRole: (role: UserRole, storeId?: string) => UserProfile[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading] = useState(false);

  const login = (role: UserRole, userId: string) => {
    const user = mockUsers.find(u => u.id === userId && u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Mock implementation
    return { error: null };
  };

  const getUserById = (id: string) => {
    return mockUsers.find(user => user.id === id);
  };

  const getUsersByRole = (role: UserRole, storeId?: string) => {
    return mockUsers.filter(user => {
      const roleMatch = user.role === role;
      if (storeId) {
        return roleMatch && user.storeId === storeId;
      }
      return roleMatch;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      signUp, 
      isAuthenticated: !!currentUser, 
      loading, 
      getUserById, 
      getUsersByRole 
    }}>
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
