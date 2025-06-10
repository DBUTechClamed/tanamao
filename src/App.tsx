
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TaskPage from "./pages/TaskPage";
import KanbanPage from "./pages/KanbanPage";
import TeamPage from "./pages/TeamPage";
import TaskCreationPage from "./pages/TaskCreationPage";
import DelegateTask from "./pages/DelegateTask";
import ComandaPage from "./pages/ComandaPage";
import StoreListPage from "./pages/StoreListPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import SupervisorStoreDetailPage from "./pages/SupervisorStoreDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Redirect authenticated users away from login page
  if (isAuthenticated && window.location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          {currentUser?.role === 'gerente' ? <ManagerDashboard /> :
           currentUser?.role === 'colaborador' ? <EmployeeDashboard /> :
           currentUser?.role === 'supervisor' ? <SupervisorDashboard /> :
           currentUser?.role === 'matriz_adm' ? <AdminDashboard /> :
           <Index />}
        </ProtectedRoute>
      } />
      <Route path="/gerente" element={
        <ProtectedRoute><ManagerDashboard /></ProtectedRoute>
      } />
      <Route path="/colaborador" element={
        <ProtectedRoute><EmployeeDashboard /></ProtectedRoute>
      } />
      <Route path="/supervisor" element={
        <ProtectedRoute><SupervisorDashboard /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute><TaskPage /></ProtectedRoute>
      } />
      <Route path="/kanban" element={
        <ProtectedRoute><KanbanPage /></ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute><TeamPage /></ProtectedRoute>
      } />
      <Route path="/create-task" element={
        <ProtectedRoute><TaskCreationPage /></ProtectedRoute>
      } />
      <Route path="/delegate-task/:taskId" element={
        <ProtectedRoute><DelegateTask /></ProtectedRoute>
      } />
      <Route path="/comanda" element={
        <ProtectedRoute><ComandaPage /></ProtectedRoute>
      } />
      <Route path="/stores" element={
        <ProtectedRoute><StoreListPage /></ProtectedRoute>
      } />
      <Route path="/store/:storeId" element={
        <ProtectedRoute><StoreDetailPage /></ProtectedRoute>
      } />
      <Route path="/supervisor/store/:storeId" element={
        <ProtectedRoute><SupervisorStoreDetailPage /></ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
