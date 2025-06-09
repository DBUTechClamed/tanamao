
import React, { useState } from 'react';
import { Task, UserProfile } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ManagerTaskCreation from './ManagerTaskCreation';
import TaskEditModal from './TaskEditModal';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  storeEmployees: UserProfile[];
  currentUser: UserProfile;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  onUpdateTask, 
  storeEmployees, 
  currentUser 
}) => {
  const { toast } = useToast();
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent_important': return 'bg-red-500';
      case 'important': return 'bg-orange-500';
      case 'urgent': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent_important': return 'Urgente/Importante';
      case 'important': return 'Importante';
      case 'urgent': return 'Urgente';
      default: return 'Normal';
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = storeEmployees.find(emp => emp.id === employeeId);
    return employee?.name || 'Não atribuído';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onUpdateTask(taskId, { status: status as any });
    
    toast({
      title: "Tarefa movida",
      description: `Tarefa movida para ${status === 'pendente' ? 'Pendentes' : status === 'em_progresso' ? 'Em Progresso' : 'Concluídas'}`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleCardClick = (task: Task, e: React.MouseEvent) => {
    // Prevent opening modal when clicking on edit button
    if ((e.target as HTMLElement).closest('.edit-button')) {
      return;
    }
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveTask = (taskId: string, updates: Partial<Task>) => {
    onUpdateTask(taskId, updates);
    setShowEditModal(false);
    setEditingTask(null);
  };

  const columns = [
    { 
      id: 'pendente', 
      title: 'Tarefas Pendentes', 
      tasks: tasks.filter(task => task.status === 'pendente'),
      bgColor: 'bg-gray-50'
    },
    { 
      id: 'em_progresso', 
      title: 'Em Progresso', 
      tasks: tasks.filter(task => task.status === 'em_progresso'),
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'concluida', 
      title: 'Concluídas', 
      tasks: tasks.filter(task => task.status === 'concluida'),
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Button 
          onClick={() => setShowTaskCreation(true)}
          className="bg-[#118f55] hover:bg-[#0f7a47] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.bgColor} p-4 rounded-lg min-h-[600px]`}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={(e) => handleCardClick(task, e)}
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white relative group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2 flex-1 pr-2">
                        {task.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge 
                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                        >
                          {getPriorityText(task.priority)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="edit-button opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => handleEditClick(task, e)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    
                    {task.assignedTo && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        {getEmployeeName(task.assignedTo)}
                      </div>
                    )}
                    
                    {task.observations && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Com observações</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskCreation && (
        <ManagerTaskCreation
          onClose={() => setShowTaskCreation(false)}
          storeEmployees={storeEmployees}
          currentUser={currentUser}
        />
      )}

      <TaskEditModal
        task={editingTask}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        storeEmployees={storeEmployees}
      />
    </div>
  );
};

export default KanbanBoard;
