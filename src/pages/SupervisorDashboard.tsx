import React, { useState } from 'react';
import Layout from '../components/Layout';
import ManagerTaskCreation from '../components/ManagerTaskCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StoreStats } from '../types';
import { CheckCircle, Clock, AlertCircle, Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// Dados de exemplo para as estatísticas das lojas
const mockStoreStats: StoreStats[] = [
  { 
    storeId: 'loja1', 
    storeName: 'Farmácia Centro', 
    storeCity: 'São Paulo',
    tasksTotal: 45, 
    tasksCompleted: 32, 
    tasksInProgress: 8, 
    tasksPending: 3, 
    tasksDelayed: 2, 
    performance: 71 
  },
  { 
    storeId: 'loja2', 
    storeName: 'Farmácia Shopping', 
    storeCity: 'Guarulhos',
    tasksTotal: 38, 
    tasksCompleted: 30, 
    tasksInProgress: 5, 
    tasksPending: 2, 
    tasksDelayed: 1, 
    performance: 79 
  },
  { 
    storeId: 'loja3', 
    storeName: 'Farmácia Norte', 
    storeCity: 'São Bernardo',
    tasksTotal: 42, 
    tasksCompleted: 25, 
    tasksInProgress: 10, 
    tasksPending: 4, 
    tasksDelayed: 3, 
    performance: 60 
  }
];

// Dados para os gráficos
const storePerformanceData = mockStoreStats.map(store => ({
  name: store.storeName,
  performance: store.performance
}));

const taskStatusData = [
  { name: 'Concluídas', value: mockStoreStats.reduce((sum, store) => sum + store.tasksCompleted, 0) },
  { name: 'Em Progresso', value: mockStoreStats.reduce((sum, store) => sum + store.tasksInProgress, 0) },
  { name: 'Pendentes', value: mockStoreStats.reduce((sum, store) => sum + store.tasksPending, 0) },
  { name: 'Atrasadas', value: mockStoreStats.reduce((sum, store) => sum + store.tasksDelayed, 0) }
];

const COLORS = ['#10B981', '#3B82F6', '#6B7280', '#EF4444'];

const SupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showTaskCreation, setShowTaskCreation] = useState(false);

  // Get all employees from all stores for task delegation
  const allEmployees = mockUsers.filter(user => 
    user.role === 'colaborador' || user.role === 'gerente'
  );

  // Calcular estatísticas gerais
  const totalTasks = mockStoreStats.reduce((sum, store) => sum + store.tasksTotal, 0);
  const totalCompleted = mockStoreStats.reduce((sum, store) => sum + store.tasksCompleted, 0);
  const totalInProgress = mockStoreStats.reduce((sum, store) => sum + store.tasksInProgress, 0);
  const totalDelayed = mockStoreStats.reduce((sum, store) => sum + store.tasksDelayed, 0);

  const handleOpenTaskCreation = () => {
    setShowTaskCreation(true);
  };

  const handleCloseTaskCreation = () => {
    setShowTaskCreation(false);
  };

  return (
    <Layout title="Dashboard Regional">
      {/* Botão superior */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Regional</h1>
        <Button 
          onClick={handleOpenTaskCreation}
          className="bg-[#118f55] hover:bg-[#0f7a47] text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Nova Tarefa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDelayed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Loja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={storePerformanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="performance" 
                    fill="#3B82F6" 
                    name="Performance (%)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status das Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Desempenho das Lojas</h3>
          <Button onClick={() => navigate('/supervisor/lojas')}>
            Ver Todas as Lojas
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Em Progresso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendentes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockStoreStats.map((store) => (
                  <tr key={store.storeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.storeCity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.tasksTotal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.tasksInProgress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.tasksPending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.tasksDelayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${store.performance >= 80 ? 'bg-green-500' : store.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${store.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{store.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/supervisor/loja/${store.storeId}`)}>
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de criação de tarefas */}
      {showTaskCreation && currentUser && (
        <ManagerTaskCreation
          onClose={handleCloseTaskCreation}
          storeEmployees={allEmployees}
          currentUser={currentUser}
        />
      )}
    </Layout>
  );
};

export default SupervisorDashboard;
