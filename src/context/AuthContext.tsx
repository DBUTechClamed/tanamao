
import React, { createContext, useContext, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface AuthContextProps {
  currentUser: UserProfile | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
  loading: boolean;
  getUserById: (id: string) => UserProfile | undefined;
  getUsersByRole: (role: UserRole, storeId?: string) => UserProfile[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    userProfile: currentUser, 
    signIn, 
    signOut, 
    signUp, 
    isAuthenticated, 
    loading 
  } = useSupabaseAuth();

  const login = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const logout = async () => {
    return await signOut();
  };

  // These would need to be implemented with a separate hook for user management
  const getUserById = (id: string) => {
    // This would be implemented with a users hook
    return undefined;
  };

  const getUsersByRole = (role: UserRole, storeId?: string) => {
    // This would be implemented with a users hook
    return [];
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      signUp, 
      isAuthenticated, 
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
