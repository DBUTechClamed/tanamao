
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { Task, UserStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockTasks, mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ManagerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter tasks for current store
  const storeTasks = mockTasks.filter(task => task.storeId === currentUser?.storeId);
  const [tasks, setTasks] = useState<Task[]>(storeTasks);
  
  // Get team stats for current store
  const storeEmployees = mockUsers.filter(user => 
    user.role === 'colaborador' && user.storeId === currentUser?.storeId
  );
  
  const mockStats = {
    pendingTasks: tasks.filter(t => t.status === 'pendente').length,
    inProgressTasks: tasks.filter(t => t.status === 'em_progresso').length,
    completedTasks: tasks.filter(t => t.status === 'concluida').length,
    lateTasks: tasks.filter(t => t.status === 'atrasada').length,
    userStats: storeEmployees.map(employee => ({
      userId: employee.id,
      userName: employee.name,
      userRole: employee.position,
      tasksAssigned: Math.floor(Math.random() * 10) + 3,
      tasksStarted: Math.floor(Math.random() * 8) + 2,
      tasksCompleted: Math.floor(Math.random() * 7) + 1,
      tasksDelayed: Math.floor(Math.random() * 3),
      performance: Math.floor(Math.random() * 40) + 60
    })) as UserStats[]
  };
  
  const handleStartTask = (taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'em_progresso', 
              startedBy: currentUser?.id || '1',
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
                  completedBy: currentUser?.id || '1',
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{stat.userRole}</td>
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
