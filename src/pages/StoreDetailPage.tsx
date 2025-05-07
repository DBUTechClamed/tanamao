
import React from 'react';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StoreStats, UserStats } from '../types';

// Mock store data
const mockStore = {
  id: '1',
  name: 'Farmácia Centro',
  address: 'Av. Paulista, 1000',
  city: 'São Paulo',
  phone: '(11) 1234-5678',
  manager: 'Ricardo Oliveira',
  tasksStats: {
    total: 45,
    completed: 32,
    inProgress: 8,
    pending: 3,
    delayed: 2,
    performance: 71
  }
};

// Mock frequency data
const frequencyData = [
  { name: 'Diária', value: 15 },
  { name: 'Semanal', value: 12 },
  { name: 'Mensal', value: 8 },
  { name: 'Trimestral', value: 5 },
  { name: 'Semestral', value: 3 },
  { name: 'Anual', value: 2 }
];

// Mock status data
const statusData = [
  { name: 'Concluídas', value: 32, color: '#10B981' },
  { name: 'Em Progresso', value: 8, color: '#3B82F6' },
  { name: 'Pendentes', value: 3, color: '#6B7280' },
  { name: 'Atrasadas', value: 2, color: '#EF4444' }
];

// Mock team data
const teamData: UserStats[] = [
  {
    userId: '1',
    userName: 'Ricardo Oliveira',
    userRole: 'Gerente',
    tasksAssigned: 15,
    tasksStarted: 15,
    tasksCompleted: 14,
    tasksDelayed: 0,
    performance: 95
  },
  {
    userId: '2',
    userName: 'Ana Souza',
    userRole: 'Farmacêutico',
    tasksAssigned: 12,
    tasksStarted: 10,
    tasksCompleted: 9,
    tasksDelayed: 1,
    performance: 85
  },
  {
    userId: '3',
    userName: 'Carlos Silva',
    userRole: 'Atendente',
    tasksAssigned: 8,
    tasksStarted: 8,
    tasksCompleted: 7,
    tasksDelayed: 0,
    performance: 92
  },
  {
    userId: '4',
    userName: 'Marina Santos',
    userRole: 'Estoquista',
    tasksAssigned: 10,
    tasksStarted: 7,
    tasksCompleted: 6,
    tasksDelayed: 2,
    performance: 70
  }
];

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Layout title={`Detalhes da Loja: ${mockStore.name}`}>
      {/* Store Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome:</p>
              <p className="text-lg">{mockStore.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Endereço:</p>
              <p className="text-lg">{mockStore.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cidade:</p>
              <p className="text-lg">{mockStore.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Telefone:</p>
              <p className="text-lg">{mockStore.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gerente:</p>
              <p className="text-lg">{mockStore.manager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Performance:</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${mockStore.tasksStats.performance >= 80 ? 'bg-green-500' : mockStore.tasksStats.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${mockStore.tasksStats.performance}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-lg">{mockStore.tasksStats.performance}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequência das Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={frequencyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4f46e5" name="Tarefas" />
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
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Atribuídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamData.map((member) => (
                  <tr key={member.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{member.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.userRole}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{member.tasksAssigned}</td>
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
