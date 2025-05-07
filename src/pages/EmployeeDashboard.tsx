
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, CheckCircle, Clock } from 'lucide-react';

// Tarefas de exemplo para o colaborador
const mockTasksData: Task[] = [
  {
    id: '5',
    title: 'Inventário de Medicamentos Controlados',
    description: 'Realizar contagem e conferência no sistema dos medicamentos controlados.',
    priority: 'urgent_important',
    frequency: 'semanal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: false,
    owner: '2', // Farmacêutico
    delegates: [],
    assignedTo: '2', // Atribuído ao farmacêutico
  },
  {
    id: '6',
    title: 'Recebimento de Mercadorias',
    description: 'Conferir a nota fiscal e produtos recebidos, armazenar adequadamente.',
    priority: 'important',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T12:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: true,
    owner: '4', // Estoquista
    delegates: [],
    assignedTo: '4', // Atribuído ao estoquista
  },
  {
    id: '7',
    title: 'Organização das Prateleiras',
    description: 'Verificar e organizar as prateleiras de acordo com o planograma.',
    priority: 'normal',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: false,
    owner: '3', // Atendente
    delegates: [],
    assignedTo: '3', // Atribuído ao atendente
  }
];

const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  
  // Filtra as tarefas que pertencem ao colaborador atual
  useEffect(() => {
    if (currentUser) {
      const filteredTasks = mockTasksData.filter(
        task => task.assignedTo === currentUser.id || task.owner === currentUser.id
      );
      setTasks(filteredTasks);
      
      // Exibir notificação de boas-vindas com as tarefas pendentes
      if (filteredTasks.length > 0) {
        toast({
          title: `Olá, ${currentUser.name}!`,
          description: `Você tem ${filteredTasks.length} tarefas pendentes hoje.`,
        });
      }
    }
  }, [currentUser, toast]);
  
  const handleStartTask = (taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'em_progresso', 
              startedBy: currentUser?.id, 
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
                  completedBy: currentUser?.id, 
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

  // Cálculo de estatísticas
  const pendingTasks = tasks.filter(t => t.status === 'pendente').length;
  const inProgressTasks = tasks.filter(t => t.status === 'em_progresso').length;
  const completedTasks = tasks.filter(t => t.status === 'concluida').length;

  return (
    <Layout title="Minhas Tarefas">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Minhas Tarefas</h3>
        {tasks.length > 0 ? (
          <TaskList 
            tasks={tasks} 
            onStart={handleStartTask}
            onComplete={handleCompleteTask}
          />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p>Você não tem tarefas atribuídas no momento.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
