
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useTasks = (storeId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tasks')
        .select(`
          *,
          task_delegates(user_id),
          owner:owner_id(id, name),
          assigned_user:assigned_to(id, name),
          started_user:started_by(id, name),
          completed_user:completed_by(id, name)
        `);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        observations: task.observations,
        priority: task.priority as any,
        frequency: task.frequency as any,
        storeId: task.store_id,
        createdAt: task.created_at,
        dueDate: task.due_date,
        status: task.status as any,
        delegable: task.delegable,
        extendable: task.extendable,
        owner: task.owner_id,
        delegates: task.task_delegates?.map((d: any) => d.user_id) || [],
        assignedTo: task.assigned_to,
        startedBy: task.started_by,
        startedAt: task.started_at,
        completedBy: task.completed_by,
        completedAt: task.completed_at
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: updates.status,
          assigned_to: updates.assignedTo,
          started_by: updates.startedBy,
          started_at: updates.startedAt,
          completed_by: updates.completedBy,
          completed_at: updates.completedAt,
          observations: updates.observations
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks(); // Refresh tasks
      
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [storeId]);

  return {
    tasks,
    loading,
    fetchTasks,
    updateTask
  };
};
