
import React from 'react';
import Layout from '../components/Layout';
import KanbanBoard from '../components/KanbanBoard';
import { useAuth } from '../context/AuthContext';
import { mockTasks } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

const KanbanPage: React.FC = () => {
  const { currentUser, getUsersByRole } = useAuth();
  const { toast } = useToast();

  const handleUpdateTask = async (taskId: string, updates: any) => {
    const taskUpdates = {
      ...updates,
      ...(updates.status === 'em_progresso' && {
        startedBy: currentUser?.id,
        startedAt: new Date().toISOString()
      }),
      ...(updates.status === 'concluida' && {
        completedBy: currentUser?.id,
        completedAt: new Date().toISOString()
      })
    };

    console.log('Updating task:', taskId, taskUpdates);
    
    toast({
      title: "Sucesso",
      description: "Tarefa atualizada com sucesso.",
    });
  };

  if (!currentUser) {
    return <Layout title="Kanban"><div>Carregando...</div></Layout>;
  }

  // Filtrar tarefas por loja do usuário
  const storeTasks = mockTasks.filter(task => task.storeId === currentUser.storeId);
  const storeEmployees = getUsersByRole('colaborador', currentUser.storeId);

  return (
    <Layout title="Kanban">
      <KanbanBoard
        tasks={storeTasks}
        onUpdateTask={handleUpdateTask}
        storeEmployees={storeEmployees}
        currentUser={currentUser}
      />
    </Layout>
  );
};

export default KanbanPage;
