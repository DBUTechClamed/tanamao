
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Usuário não está autenticado
    return <Navigate to="/" replace />;
  }

  if (currentUser && roles.includes(currentUser.role)) {
    // Usuário autenticado e com papel permitido
    return <>{children}</>;
  }

  // Usuário autenticado mas sem papel permitido
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
