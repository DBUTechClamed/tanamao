
import React from 'react';
import { Task, TaskPriority, UserProfile } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, User, CheckCircle, Play, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onDelegate?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onComplete,
  onDelegate
}) => {
  const navigate = useNavigate();
  const { currentUser, getUserById } = useAuth();
  
  const getPriorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case 'urgent_important': return 'Urgente e Importante';
      case 'important': return 'Importante';
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      default: return 'Desconhecida';
    }
  };

  const getPriorityClass = (priority: TaskPriority): string => {
    switch (priority) {
      case 'urgent_important': return 'task-urgent-important';
      case 'important': return 'task-important';
      case 'urgent': return 'task-urgent';
      case 'normal': return 'task-normal';
      default: return '';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-gray-100">Pendente</Badge>;
      case 'em_progresso':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'atrasada':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Atrasada</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const assignedUser = task.assignedTo ? getUserById(task.assignedTo) : undefined;
  const canStart = task.status === 'pendente' && 
    (currentUser?.id === task.assignedTo || currentUser?.id === task.owner);
  const canComplete = task.status === 'em_progresso' && 
    (currentUser?.id === task.assignedTo || currentUser?.id === task.startedBy);
  const canDelegate = task.delegable && 
    currentUser?.role === 'gerente' && 
    task.status === 'pendente';

  return (
    <Card className={`mb-4 ${getPriorityClass(task.priority)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>Prazo: {formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center">
            <CalendarCheck className="h-4 w-4 mr-1 text-gray-500" />
            <span>Frequência: {task.frequency}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-gray-500" />
            <span>
              {assignedUser 
                ? `Atribuído a: ${assignedUser.name}` 
                : 'Não atribuído'}
            </span>
          </div>
          <div className="flex items-center">
            <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex flex-wrap gap-2">
        {canStart && onStart && (
          <Button variant="outline" className="border-blue-500 text-blue-500" onClick={() => onStart(task.id)}>
            <Play className="mr-1 h-4 w-4" />
            Iniciar
          </Button>
        )}
        
        {canComplete && onComplete && (
          <Button 
            onClick={() => onComplete(task.id)} 
            className="fingerprint-button bg-green-600 hover:bg-green-700"
          >
            <span className="flex items-center">
              <CheckCircle className="mr-1 h-4 w-4" />
              Concluir
            </span>
            <div className="fingerprint-overlay">
              <div className="animate-pulse-fingerprint">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Button>
        )}
        
        {canDelegate && onDelegate && (
          <Button variant="outline" className="border-orange-500 text-orange-500" onClick={() => onDelegate(task.id)}>
            <Users className="mr-1 h-4 w-4" />
            Delegar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
