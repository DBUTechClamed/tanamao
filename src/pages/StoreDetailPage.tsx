
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StoreStats, UserStats, TaskFrequency } from '../types';

// Dados de exemplo para detalhes da loja
const mockStoreDetails: { [key: string]: StoreStats & { storeCity: string, storeManager: string } } = {
  '1': { 
    storeId: '1', 
    storeName: 'Farmácia Centro', 
    storeCity: 'São Paulo',
    storeManager: 'João Silva',
    tasksTotal: 45, 
    tasksCompleted: 32, 
    tasksInProgress: 8, 
    tasksPending: 3, 
    tasksDelayed: 2, 
    performance: 71 
  },
  '2': { 
    storeId: '2', 
    storeName: 'Farmácia Shopping', 
    storeCity: 'São Paulo',
    storeManager: 'Ana Paula',
    tasksTotal: 38, 
    tasksCompleted: 30, 
    tasksInProgress: 5, 
    tasksPending: 2, 
    tasksDelayed: 1, 
    performance: 79 
  },
  '3': { 
    storeId: '3', 
    storeName: 'Farmácia Norte', 
    storeCity: 'Campinas',
    storeManager: 'Carlos Eduardo',
    tasksTotal: 42, 
    tasksCompleted: 25, 
    tasksInProgress: 10, 
    tasksPending: 4, 
    tasksDelayed: 3, 
    performance: 60 
  },
};

// Dados de exemplo para colaboradores da loja
const mockStoreStaff: { [key: string]: UserStats[] } = {
  '1': [
    { userId: '101', userName: 'Maria Silva', userRole: 'Farmacêutica', tasksAssigned: 10, tasksStarted: 9, tasksCompleted: 8, tasksDelayed: 1, performance: 80 },
    { userId: '102', userName: 'Pedro Santos', userRole: 'Atendente', tasksAssigned: 8, tasksStarted: 8, tasksCompleted: 8, tasksDelayed: 0, performance: 100 },
    { userId: '103', userName: 'Ana Costa', userRole: 'Estoquista', tasksAssigned: 12, tasksStarted: 10, tasksCompleted: 9, tasksDelayed: 1, performance: 75 },
    { userId: '104', userName: 'Ricardo Lima', userRole: 'Jovem Aprendiz', tasksAssigned: 5, tasksStarted: 4, tasksCompleted: 3, tasksDelayed: 0, performance: 60 }
  ],
  '2': [
    { userId: '201', userName: 'Juliana Ferreira', userRole: 'Farmacêutica', tasksAssigned: 12, tasksStarted: 12, tasksCompleted: 11, tasksDelayed: 0, performance: 92 },
    { userId: '202', userName: 'Fernando Oliveira', userRole: 'Atendente', tasksAssigned: 9, tasksStarted: 8, tasksCompleted: 7, tasksDelayed: 1, performance: 78 },
    { userId: '203', userName: 'Camila Rocha', userRole: 'Estoquista', tasksAssigned: 10, tasksStarted: 10, tasksCompleted: 9, tasksDelayed: 0, performance: 90 }
  ],
  '3': [
    { userId: '301', userName: 'Roberto Alves', userRole: 'Farmacêutico', tasksAssigned: 14, tasksStarted: 12, tasksCompleted: 9, tasksDelayed: 2, performance: 64 },
    { userId: '302', userName: 'Luciana Martins', userRole: 'Atendente', tasksAssigned: 10, tasksStarted: 8, tasksCompleted: 6, tasksDelayed: 1, performance: 60 },
    { userId: '303', userName: 'Paulo Vieira', userRole: 'Estoquista', tasksAssigned: 11, tasksStarted: 10, tasksCompleted: 8, tasksDelayed: 0, performance: 73 },
    { userId: '304', userName: 'Carla Santos', userRole: 'Estagiária', tasksAssigned: 7, tasksStarted: 5, tasksCompleted: 2, tasksDelayed: 0, performance: 29 }
  ]
};

// Dados de exemplo para frequência das tarefas
const mockTaskFrequency: { [key: string]: Array<{ name: TaskFrequency, value: number }> } = {
  '1': [
    { name: 'diaria', value: 18 },
    { name: 'semanal', value: 10 },
    { name: 'mensal', value: 8 },
    { name: 'bimestral', value: 4 },
    { name: 'trimestral', value: 3 },
    { name: 'semestral', value: 1 },
    { name: 'anual', value: 1 }
  ],
  '2': [
    { name: 'diaria', value: 15 },
    { name: 'semanal', value: 8 },
    { name: 'mensal', value: 7 },
    { name: 'bimestral', value: 3 },
    { name: 'trimestral', value: 3 },
    { name: 'semestral', value: 1 },
    { name: 'anual', value: 1 }
  ],
  '3': [
    { name: 'diaria', value: 20 },
    { name: 'semanal', value: 9 },
    { name: 'mensal', value: 6 },
    { name: 'bimestral', value: 3 },
    { name: 'trimestral', value: 2 },
    { name: 'semestral', value: 1 },
    { name: 'anual', value: 1 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const TASK_STATUS_COLORS = ['#10B981', '#3B82F6', '#6B7280', '#EF4444'];

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  // Get store data based on storeId
  const store = mockStoreDetails[storeId || '1']; // fallback to first store if not found
  const storeStaff = mockStoreStaff[storeId || '1'];
  const taskFrequency = mockTaskFrequency[storeId || '1'];
  
  if (!store) {
    return (
      <Layout title="Erro">
        <div className="text-center p-8">
          <h2 className="text-lg font-medium">Loja não encontrada</h2>
          <p className="mt-2 text-gray-500">A loja solicitada não foi encontrada no sistema.</p>
          <Button className="mt-4" onClick={() => navigate('/supervisor/lojas')}>
            Voltar para a lista de lojas
          </Button>
        </div>
      </Layout>
    );
  }

  // Dados para o gráfico de status das tarefas
  const taskStatusData = [
    { name: 'Concluídas', value: store.tasksCompleted },
    { name: 'Em Progresso', value: store.tasksInProgress },
    { name: 'Pendentes', value: store.tasksPending },
    { name: 'Atrasadas', value: store.tasksDelayed }
  ];

  return (
    <Layout title={`Detalhes - ${store.storeName}`}>
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate('/supervisor/lojas')}
      >
        Voltar para Lista de Lojas
      </Button>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.tasksTotal}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.tasksCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.tasksInProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.tasksDelayed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Frequência das Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskFrequency}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Quantidade" fill="#8884d8">
                    {taskFrequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
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
                      <Cell key={`cell-${index}`} fill={TASK_STATUS_COLORS[index % TASK_STATUS_COLORS.length]} />
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

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Colaborador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Atribuídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Iniciadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {storeStaff.map((member) => (
                  <tr key={member.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{member.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.userRole}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.tasksAssigned}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.tasksStarted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.tasksDelayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${member.performance >= 80 ? 'bg-green-500' : member.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${member.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{member.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default StoreDetailPage;
