
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppSidebar from "./components/AppSidebar";

import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import KanbanPage from "./pages/KanbanPage";
import TaskPage from "./pages/TaskPage";
import TeamPage from "./pages/TeamPage";
import ComandaPage from "./pages/ComandaPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import StoreListPage from "./pages/StoreListPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import SupervisorStoreDetailPage from "./pages/SupervisorStoreDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import TaskCreationPage from "./pages/TaskCreationPage";
import DelegateTask from "./pages/DelegateTask";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Login />} />
                
                <Route 
                  path="/gerente" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gerente/kanban" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <KanbanPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gerente/tarefas" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <TaskPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gerente/equipe" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <TeamPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gerente/comanda" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <ComandaPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gerente/delegar/:taskId" 
                  element={
                    <ProtectedRoute roles={['gerente']}>
                      <DelegateTask />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/colaborador" 
                  element={
                    <ProtectedRoute roles={['colaborador']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/colaborador/tarefas" 
                  element={
                    <ProtectedRoute roles={['colaborador']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/supervisor" 
                  element={
                    <ProtectedRoute roles={['supervisor']}>
                      <SupervisorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supervisor/lojas" 
                  element={
                    <ProtectedRoute roles={['supervisor']}>
                      <StoreListPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supervisor/loja/:storeId" 
                  element={
                    <ProtectedRoute roles={['supervisor']}>
                      <StoreDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supervisor/loja/:storeId/detalhes" 
                  element={
                    <ProtectedRoute roles={['supervisor']}>
                      <SupervisorStoreDetailPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute roles={['matriz_adm']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/cadastrar-tarefa" 
                  element={
                    <ProtectedRoute roles={['matriz_adm']}>
                      <TaskCreationPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
