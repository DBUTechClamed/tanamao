
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats } from '../types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for the team members
const mockTeamMembers: UserStats[] = [
  {
    userId: '1',
    userName: 'João Silva',
    userRole: 'Farmacêutico',
    tasksAssigned: 12,
    tasksStarted: 10,
    tasksCompleted: 9,
    tasksDelayed: 1,
    performance: 85
  },
  {
    userId: '2',
    userName: 'Maria Oliveira',
    userRole: 'Atendente',
    tasksAssigned: 8,
    tasksStarted: 8,
    tasksCompleted: 7,
    tasksDelayed: 0,
    performance: 92
  },
  {
    userId: '3',
    userName: 'Pedro Santos',
    userRole: 'Estoquista',
    tasksAssigned: 10,
    tasksStarted: 7,
    tasksCompleted: 6,
    tasksDelayed: 2,
    performance: 70
  },
  {
    userId: '4',
    userName: 'Ana Souza',
    userRole: 'Jovem Aprendiz',
    tasksAssigned: 6,
    tasksStarted: 5,
    tasksCompleted: 3,
    tasksDelayed: 1,
    performance: 68
  },
  {
    userId: '5',
    userName: 'Carlos Ferreira',
    userRole: 'Farmacêutico',
    tasksAssigned: 15,
    tasksStarted: 15,
    tasksCompleted: 14,
    tasksDelayed: 0,
    performance: 95
  },
  {
    userId: '6',
    userName: 'Juliana Lima',
    userRole: 'Estagiário',
    tasksAssigned: 7,
    tasksStarted: 7,
    tasksCompleted: 5,
    tasksDelayed: 1,
    performance: 78
  }
];

const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [performanceFilter, setPerformanceFilter] = useState<string>('todos');

  // Extract unique roles for filter
  const roles = Array.from(new Set(mockTeamMembers.map(member => member.userRole)));

  // Filter team members based on search term and filters
  const filteredTeamMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.userRole && member.userRole.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'todos' || member.userRole === roleFilter;
    
    const matchesPerformance = performanceFilter === 'todos' ||
                              (performanceFilter === 'alta' && member.performance >= 80) ||
                              (performanceFilter === 'media' && member.performance >= 60 && member.performance < 80) ||
                              (performanceFilter === 'baixa' && member.performance < 60);
    
    return matchesSearch && matchesRole && matchesPerformance;
  });

  return (
    <Layout title="Equipe">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar membro da equipe..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Cargos</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={performanceFilter}
            onValueChange={setPerformanceFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Performances</SelectItem>
              <SelectItem value="alta">Alta (≥80%)</SelectItem>
              <SelectItem value="media">Média (60-79%)</SelectItem>
              <SelectItem value="baixa">Baixa (&lt;60%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
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
                {filteredTeamMembers.map((member) => (
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
