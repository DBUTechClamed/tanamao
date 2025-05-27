
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Task, UserProfile } from '../types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Users } from 'lucide-react';
import { mockTasks, mockUsers } from '../data/mockData';

const DelegateTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para armazenar a tarefa atual
  const [task, setTask] = useState<Task | null>(null);
  
  // Estado para armazenar o usuário selecionado e a data de vencimento
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  
  // Buscar a tarefa pelo ID
  useEffect(() => {
    if (taskId) {
      const foundTask = mockTasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        setDueDate(format(new Date(foundTask.dueDate), 'yyyy-MM-dd'));
      }
    }
  }, [taskId]);
  
  // Obter colaboradores da loja
  const storeEmployees = mockUsers.filter(user => 
    user.role === 'colaborador' && user.storeId === currentUser?.storeId
  );
  
  // Obter delegados sugeridos
  const suggestedDelegates = task?.delegates
    .map(id => mockUsers.find(user => user.id === id))
    .filter(Boolean) as UserProfile[];
  
  const handleDelegateTask = () => {
    if (!selectedUserId) {
      toast({
        title: "Selecione um colaborador",
        description: "Você precisa selecionar um colaborador para delegar a tarefa.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedUser = mockUsers.find(user => user.id === selectedUserId);
    
    toast({
      title: "Tarefa delegada com sucesso",
      description: `A tarefa foi delegada para ${selectedUser?.name}.`,
    });
    
    // Redirecionar para a dashboard do gerente
    navigate('/gerente');
  };
  
  if (!task) {
    return (
      <Layout title="Delegar Tarefa">
        <div className="flex items-center justify-center h-64">
          <p>Carregando tarefa...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Delegar Tarefa">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            
            {task.observations && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Observações/Instruções:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{task.observations}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="mb-1 block">Prioridade</Label>
              <div className={`inline-block px-2 py-1 rounded text-sm ${
                task.priority === 'urgent_important' ? 'bg-red-100 text-red-800' :
                task.priority === 'important' ? 'bg-blue-100 text-blue-800' :
                task.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority === 'urgent_important' ? 'Urgente e Importante' :
                 task.priority === 'important' ? 'Importante' :
                 task.priority === 'urgent' ? 'Urgente' : 'Normal'}
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Frequência</Label>
              <div className="inline-block bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                {task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {suggestedDelegates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Delegados Sugeridos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedDelegates.map((delegate) => (
              <Card key={delegate.id} className="cursor-pointer hover:border-primary" onClick={() => setSelectedUserId(delegate.id)}>
                <CardContent className={`p-4 flex items-center gap-3 ${selectedUserId === delegate.id ? 'bg-blue-50 border border-blue-200' : ''}`}>
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{delegate.name}</p>
                    <p className="text-xs text-gray-500">{delegate.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="employee" className="mb-2 block">Selecione o colaborador</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Selecione um colaborador" />
            </SelectTrigger>
            <SelectContent>
              {storeEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dueDate" className="mb-2 block">Data de Vencimento</Label>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/gerente')}>Cancelar</Button>
        <Button onClick={handleDelegateTask}>Delegar Tarefa</Button>
      </div>
    </Layout>
  );
};

export default DelegateTask;
