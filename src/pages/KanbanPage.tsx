
import React from 'react';
import Layout from '../components/Layout';
import KanbanBoard from '../components/KanbanBoard';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

const KanbanPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const { tasks, updateTask } = useTasks(currentUser?.storeId);
  const { users: storeEmployees } = useUsers(currentUser?.storeId);

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

    await updateTask(taskId, taskUpdates);
  };

  if (!currentUser) {
    return <Layout title="Kanban"><div>Carregando...</div></Layout>;
  }

  const filteredEmployees = storeEmployees.filter(user => user.role === 'colaborador');

  return (
    <Layout title="Kanban">
      <KanbanBoard
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        storeEmployees={filteredEmployees}
        currentUser={currentUser}
      />
    </Layout>
  );
};

export default KanbanPage;
