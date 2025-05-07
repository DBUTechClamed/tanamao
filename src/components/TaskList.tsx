
import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Task, TaskFrequency } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onDelegate?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStart, onComplete, onDelegate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFrequency = frequencyFilter === 'todas' || task.frequency === frequencyFilter;
    
    const matchesStatus = statusFilter === 'todos' || task.status === statusFilter;
    
    return matchesSearch && matchesFrequency && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={frequencyFilter}
            onValueChange={setFrequencyFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas Frequências</SelectItem>
              <SelectItem value="diaria">Diária</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="bimestral">Bimestral</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="pontual">Pontual</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="em_progresso">Em Progresso</SelectItem>
              <SelectItem value="concluida">Concluídas</SelectItem>
              <SelectItem value="atrasada">Atrasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={onStart}
              onComplete={onComplete}
              onDelegate={onDelegate}
            />
          ))
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
