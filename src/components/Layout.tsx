
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CheckSquare, Users, LogOut, Building, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define o título da página com base no perfil do usuário
  const getRoleTitle = () => {
    switch (currentUser?.role) {
      case 'gerente': return 'Gerente de Loja';
      case 'colaborador': return `Colaborador - ${currentUser?.position}`;
      case 'supervisor': return 'Supervisor Regional';
      case 'matriz_adm': return 'Administrador Matriz';
      default: return '';
    }
  };

  const getNavigationItems = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'gerente':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, path: '/gerente' },
          { label: 'Tarefas', icon: <CheckSquare className="mr-2 h-4 w-4" />, path: '/gerente/tarefas' },
          { label: 'Equipe', icon: <Users className="mr-2 h-4 w-4" />, path: '/gerente/equipe' },
        ];
      case 'colaborador':
        return [
          { label: 'Minhas Tarefas', icon: <CheckSquare className="mr-2 h-4 w-4" />, path: '/colaborador' }
        ];
      case 'supervisor':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, path: '/supervisor' },
          { label: 'Lojas', icon: <Building className="mr-2 h-4 w-4" />, path: '/supervisor/lojas' },
        ];
      case 'matriz_adm':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, path: '/admin' },
          { label: 'Cadastro de Tarefas', icon: <CheckSquare className="mr-2 h-4 w-4" />, path: '/admin/tarefas/novo' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-primary text-white py-4 px-6 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">TáNaMão</h1>
            <div className="h-6 border-r border-white/30" />
            <span className="text-sm font-medium">{getRoleTitle()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-right">
              <p className="font-medium">{currentUser?.name}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Navegação lateral e conteúdo principal */}
      <div className="flex-1 flex">
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
            <div className="pt-4 mt-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </nav>
        </aside>
        
        <main className="flex-1 p-6 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
