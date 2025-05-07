
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats } from '../types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from 'recharts';

// Dados de exemplo para a equipe
const mockTeamStats: UserStats[] = [
  { 
    userId: '2', 
    userName: 'Maria Oliveira',
    userRole: 'Farmacêutica', 
    tasksAssigned: 12, 
    tasksStarted: 10, 
    tasksCompleted: 9, 
    tasksDelayed: 1, 
    performance: 85 
  },
  { 
    userId: '3', 
    userName: 'Pedro Santos',
    userRole: 'Atendente', 
    tasksAssigned: 8, 
    tasksStarted: 8, 
    tasksCompleted: 8, 
    tasksDelayed: 0, 
    performance: 100 
  },
  { 
    userId: '4', 
    userName: 'Ana Costa',
    userRole: 'Estoquista', 
    tasksAssigned: 15, 
    tasksStarted: 14, 
    tasksCompleted: 12, 
    tasksDelayed: 2, 
    performance: 80 
  },
  { 
    userId: '5', 
    userName: 'Ricardo Lima',
    userRole: 'Jovem Aprendiz', 
    tasksAssigned: 5, 
    tasksStarted: 5, 
    tasksCompleted: 4, 
    tasksDelayed: 1, 
    performance: 75 
  },
  { 
    userId: '6', 
    userName: 'Julia Mendes',
    userRole: 'Estagiária', 
    tasksAssigned: 7, 
    tasksStarted: 7, 
    tasksCompleted: 6, 
    tasksDelayed: 0, 
    performance: 90 
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredTeam = mockTeamStats.filter(
    member => 
      member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dados para o gráfico de desempenho da equipe
  const teamPerformanceData = filteredTeam.map((member, index) => ({
    name: member.userName,
    value: member.performance,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Layout title="Equipe">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamPerformanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {teamPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-4">
                {filteredTeam.map(member => (
                  <div key={member.userId} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{member.userName}</h3>
                    <p className="text-sm text-gray-500 mb-2">{member.userRole}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Tarefas atribuídas: {member.tasksAssigned}</div>
                      <div>Tarefas iniciadas: {member.tasksStarted}</div>
                      <div>Tarefas concluídas: {member.tasksCompleted}</div>
                      <div>Tarefas atrasadas: {member.tasksDelayed}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membros da Equipe</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar colaborador..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Atribuídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefas Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeam.map((member) => (
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

export default TeamPage;
