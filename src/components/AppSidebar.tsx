
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clipboard, Users, Building, ListChecks, Home, PlusSquare } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'gerente':
        return [
          { title: "Dashboard", path: "/gerente/dashboard", icon: Home },
          { title: "Tarefas", path: "/gerente/tarefas", icon: Clipboard },
          { title: "Equipe", path: "/gerente/equipe", icon: Users }
        ];
      case 'colaborador':
        return [
          { title: "Minhas Tarefas", path: "/colaborador/tarefas", icon: Clipboard }
        ];
      case 'supervisor':
        return [
          { title: "Dashboard", path: "/supervisor/dashboard", icon: Home },
          { title: "Lojas", path: "/supervisor/lojas", icon: Building }
        ];
      case 'matriz_adm':
        return [
          { title: "Dashboard", path: "/admin/dashboard", icon: Home },
          { title: "Cadastrar Tarefa", path: "/admin/cadastrar-tarefa", icon: PlusSquare }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border" style={{ backgroundColor: '#118f55' }}>
        <div className="flex items-center px-4 py-2">
          <div className="mr-2 h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <ListChecks className="h-5 w-5 text-[#118f55]" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl text-white">TáNaMão</h3>
            <p className="text-xs text-white/70">
              {currentUser?.role === 'gerente' && 'Gerente de Loja'}
              {currentUser?.role === 'colaborador' && 'Colaborador'}
              {currentUser?.role === 'supervisor' && 'Supervisor Regional'}
              {currentUser?.role === 'matriz_adm' && 'Matriz ADM'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <NavLink to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#118f55] text-white flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser?.name || 'Usuário'}</p>
            </div>
          </div>
          <button 
            className="text-sm text-red-500 hover:text-red-700"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
