
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TaskFrequency, TaskPriority, UserProfile } from '../types';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ManagerTaskCreationProps {
  onClose: () => void;
  storeEmployees: UserProfile[];
  currentUser: UserProfile;
}

const ManagerTaskCreation: React.FC<ManagerTaskCreationProps> = ({ 
  onClose, 
  storeEmployees, 
  currentUser 
}) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>('pontual');
  const [priority, setPriority] = useState<TaskPriority>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !assignedTo || !dueDate) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você implementaria a lógica para salvar a tarefa
    console.log('Nova tarefa criada:', {
      title,
      description,
      observations,
      assignedTo,
      dueDate,
      frequency,
      priority,
      storeId: currentUser.storeId,
      createdBy: currentUser.id
    });
    
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada e delegada com sucesso.",
    });
    
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setObservations('');
    setAssignedTo('');
    setDueDate('');
    setFrequency('pontual');
    setPriority('normal');
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent_important': return 'Urgente e Importante';
      case 'important': return 'Importante';
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Cadastrar Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da tarefa"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição detalhada da tarefa"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                Observações/Instruções
              </label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Instruções específicas, materiais necessários, etc."
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                Delegar para *
              </label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {storeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position || 'Colaborador'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Prazo *
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência
                </label>
                <Select value={frequency} onValueChange={(value: TaskFrequency) => setFrequency(value)}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pontual">Pontual</SelectItem>
                    <SelectItem value="diaria">Diária</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="bimestral">Bimestral</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent_important">Urgente e Importante</SelectItem>
                    <SelectItem value="important">Importante</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Limpar
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#118f55] hover:bg-[#0f7a49] text-white">
                  Criar Tarefa
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerTaskCreation;
