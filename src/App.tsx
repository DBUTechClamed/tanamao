
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
              path="/gerente/tarefas" 
              element={
                <ProtectedRoute roles={['gerente']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gerente/equipe" 
              element={
                <ProtectedRoute roles={['gerente']}>
                  <ManagerDashboard />
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
                  <SupervisorDashboard />
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
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
