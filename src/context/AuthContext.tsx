
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextProps {
  currentUser: UserProfile | null;
  login: (role: UserRole, userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getUserById: (id: string) => UserProfile | undefined;
  getUsersByRole: (role: UserRole, storeId?: string) => UserProfile[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há um usuário no localStorage quando o componente monta
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (role: UserRole, userId: string) => {
    const user = mockUsers.find(u => u.id === userId && u.role === role);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      console.error('Usuário não encontrado');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const getUserById = (id: string) => {
    return mockUsers.find(u => u.id === id);
  };

  const getUsersByRole = (role: UserRole, storeId?: string) => {
    if (storeId) {
      return mockUsers.filter(u => u.role === role && u.storeId === storeId);
    }
    return mockUsers.filter(u => u.role === role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, getUserById, getUsersByRole }}>
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
