
import React, { useState } from 'react';
import Layout from '../components/Layout';
import KanbanBoard from '../components/KanbanBoard';
import { Task } from '../types';
import { mockTasks, mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const KanbanPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Filter tasks for current store
  const storeTasks = mockTasks.filter(task => task.storeId === currentUser?.storeId);
  const [tasks, setTasks] = useState<Task[]>(storeTasks);
  
  // Get team for current store
  const storeEmployees = mockUsers.filter(user => 
    user.role === 'colaborador' && user.storeId === currentUser?.storeId
  );

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              ...updates,
              ...(updates.status === 'em_progresso' && {
                startedBy: currentUser?.id,
                startedAt: new Date().toISOString()
              }),
              ...(updates.status === 'concluida' && {
                completedBy: currentUser?.id,
                completedAt: new Date().toISOString()
              })
            } 
          : task
      )
    );
  };

  if (!currentUser) {
    return <Layout title="Kanban"><div>Carregando...</div></Layout>;
  }

  return (
    <Layout title="Kanban">
      <KanbanBoard
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        storeEmployees={storeEmployees}
        currentUser={currentUser}
      />
    </Layout>
  );
};

export default KanbanPage;
