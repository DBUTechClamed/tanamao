
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Redirecionar baseado no papel do usuário
      switch (currentUser.role) {
        case 'gerente':
          navigate('/gerente', { replace: true });
          break;
        case 'colaborador':
          navigate('/colaborador', { replace: true });
          break;
        case 'supervisor':
          navigate('/supervisor', { replace: true });
          break;
        case 'matriz_adm':
          navigate('/admin', { replace: true });
          break;
        default:
          // Se não há papel definido, ficar na página atual
          break;
      }
    }
  }, [currentUser, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#118f55]">TÁ NA MÃO</h1>
          <p className="text-xl text-gray-600 mb-8">Sistema de Gestão de Tarefas</p>
          <a 
            href="/login" 
            className="bg-[#118f55] hover:bg-[#0f7a47] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  // Se chegou aqui, o usuário está logado mas não tem papel definido
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#118f55]">TÁ NA MÃO</h1>
        <p className="text-xl text-gray-600 mb-4">Bem-vindo, {currentUser?.name}!</p>
        <p className="text-gray-500">Aguardando definição de papel no sistema...</p>
      </div>
    </div>
  );
};

export default Index;
