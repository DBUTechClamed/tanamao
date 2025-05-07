
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { Task, UserStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tarefas de exemplo para o gerente
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Conferência de Estoque de Medicamentos',
    description: 'Verificar o estoque de todos os medicamentos controlados e atualizar no sistema.',
    priority: 'urgent_important',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'pendente',
    delegable: true,
    extendable: false,
    owner: '1', // Gerente
    delegates: ['2', '4'], // Farmacêutico, Estoquista
  },
  {
    id: '2',
    title: 'Revisão de Validades',
    description: 'Verificar produtos próximos ao vencimento e organizar para promoção ou devolução.',
    priority: 'important',
    frequency: 'semanal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-07T17:00:00.000Z',
    status: 'pendente',
    delegable: true,
    extendable: true,
    owner: '1', // Gerente
    delegates: ['3', '4'], // Atendente, Estoquista
  },
  {
    id: '3',
    title: 'Limpeza da Área de Atendimento',
    description: 'Realizar limpeza completa da área de atendimento ao cliente.',
    priority: 'normal',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'em_progresso',
    delegable: true,
    extendable: false,
    owner: '3', // Atendente
    delegates: [],
    assignedTo: '3',
    startedBy: '3',
    startedAt: '2023-05-01T09:30:00.000Z',
  },
  {
    id: '4',
    title: 'Relatório de Vendas Semanal',
    description: 'Preparar o relatório de vendas da semana anterior e enviar para matriz.',
    priority: 'urgent',
    frequency: 'semanal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-02T12:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: true,
    owner: '1', // Gerente
    delegates: [],
  }
];

// Estatísticas de exemplo para o dashboard do gerente
const mockStats = {
  pendingTasks: 3,
  inProgressTasks: 1,
  completedTasks: 8,
  lateTasks: 0,
  userStats: [
    { userId: '2', userName: 'Maria Oliveira', tasksAssigned: 5, tasksStarted: 5, tasksCompleted: 4, tasksDelayed: 1, performance: 80 },
    { userId: '3', userName: 'Pedro Santos', tasksAssigned: 3, tasksStarted: 3, tasksCompleted: 3, tasksDelayed: 0, performance: 100 },
    { userId: '4', userName: 'Ana Costa', tasksAssigned: 4, tasksStarted: 4, tasksCompleted: 3, tasksDelayed: 1, performance: 75 }
  ] as UserStats[]
};

const ManagerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartTask = (taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'em_progresso', 
              startedBy: '1', // ID do gerente 
              startedAt: new Date().toISOString() 
            } 
          : task
      )
    );
    
    toast({
      title: "Tarefa iniciada",
      description: "Você começou a trabalhar nesta tarefa.",
    });
  };
  
  const handleCompleteTask = (taskId: string) => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setTasks(currentTasks => 
          currentTasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: 'concluida', 
                  completedBy: '1', // ID do gerente 
                  completedAt: new Date().toISOString() 
                } 
              : task
          )
        );
        
        toast({
          title: "Tarefa concluída",
          description: "A tarefa foi marcada como concluída com sucesso.",
          variant: "default",
        });
        
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    toast({
      title: "Verificação Biométrica",
      description: "Pressione ESPAÇO para simular a leitura biométrica.",
      variant: "default",
    });
  };
  
  const handleDelegateTask = (taskId: string) => {
    navigate(`/gerente/delegar/${taskId}`);
  };

  return (
    <Layout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.inProgressTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.lateTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Desempenho da Equipe</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atribuídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iniciadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockStats.userStats.map((stat) => (
                  <tr key={stat.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{stat.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.tasksAssigned}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.tasksStarted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.tasksDelayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${stat.performance >= 80 ? 'bg-green-500' : stat.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${stat.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{stat.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Tarefas do Dia</h3>
        <TaskList 
          tasks={tasks} 
          onStart={handleStartTask}
          onComplete={handleCompleteTask}
          onDelegate={handleDelegateTask}
        />
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
