
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppSidebar from "./components/AppSidebar";

import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import TaskPage from "./pages/TaskPage";
import TeamPage from "./pages/TeamPage";
import ComandaPage from "./pages/ComandaPage";
import EmployeeComandaPage from "./pages/EmployeeComandaPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import StoreListPage from "./pages/StoreListPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import SupervisorStoreDetailPage from "./pages/SupervisorStoreDetailPage";
import AssignTaskToStore from "./pages/AssignTaskToStore";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTaskPage from "./pages/CreateTaskPage";
import DelegateTask from "./pages/DelegateTask";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/*" 
              element={
                <SidebarProvider className="flex min-h-screen w-full">
                  <AppSidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      {/* Rotas do Gerente de Loja */}
                      <Route 
                        path="/gerente" 
                        element={
                          <ProtectedRoute roles={['gerente']}>
                            <Navigate to="/gerente/dashboard" replace />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/gerente/dashboard" 
                        element={
                          <ProtectedRoute roles={['gerente']}>
                            <ManagerDashboard />
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
                        path="/gerente/equipe/:colaboradorId/comanda" 
                        element={
                          <ProtectedRoute roles={['gerente']}>
                            <EmployeeComandaPage />
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
                      
                      {/* Rotas do Colaborador */}
                      <Route 
                        path="/colaborador" 
                        element={
                          <ProtectedRoute roles={['colaborador']}>
                            <Navigate to="/colaborador/tarefas" replace />
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
                      
                      {/* Rotas do Supervisor Regional */}
                      <Route 
                        path="/supervisor" 
                        element={
                          <ProtectedRoute roles={['supervisor']}>
                            <Navigate to="/supervisor/dashboard" replace />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/supervisor/dashboard" 
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
                        path="/supervisor/lojas/:lojaId/atribuir-tarefa" 
                        element={
                          <ProtectedRoute roles={['supervisor']}>
                            <AssignTaskToStore />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Rotas do Administrador Matriz */}
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute roles={['matriz_adm']}>
                            <Navigate to="/admin/dashboard" replace />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/dashboard" 
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
                            <CreateTaskPage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </SidebarProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
