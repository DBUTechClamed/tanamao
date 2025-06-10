
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, CheckCircle, Clock } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { tasks, updateTask } = useTasks(currentUser?.storeId);
  
  // Filtrar tarefas do colaborador atual
  const userTasks = tasks.filter(
    task => (task.assignedTo === currentUser?.id || task.owner === currentUser?.id)
  );
  
  useEffect(() => {
    if (currentUser && userTasks.length > 0) {
      toast({
        title: `Olá, ${currentUser.name}!`,
        description: `Você tem ${userTasks.filter(t => t.status === 'pendente').length} tarefas pendentes hoje.`,
      });
    }
  }, [currentUser, userTasks.length, toast]);
  
  const handleStartTask = async (taskId: string) => {
    await updateTask(taskId, {
      status: 'em_progresso',
      startedBy: currentUser?.id,
      startedAt: new Date().toISOString()
    });
    
    toast({
      title: "Tarefa iniciada",
      description: "Você começou a trabalhar nesta tarefa.",
    });
  };
  
  const handleCompleteTask = (taskId: string) => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        await updateTask(taskId, {
          status: 'concluida',
          completedBy: currentUser?.id,
          completedAt: new Date().toISOString()
        });
        
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
  const pendingTasks = userTasks.filter(t => t.status === 'pendente').length;
  const inProgressTasks = userTasks.filter(t => t.status === 'em_progresso').length;
  const completedTasks = userTasks.filter(t => t.status === 'concluida').length;

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
        {userTasks.length > 0 ? (
          <TaskList 
            tasks={userTasks} 
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
