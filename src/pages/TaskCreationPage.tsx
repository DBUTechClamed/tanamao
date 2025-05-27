
import React, { useState } from 'react';
import Layout from '../components/Layout';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Trash2, Edit } from 'lucide-react';
import { Task, TaskFrequency, TaskPriority } from '../types';
import { useToast } from '@/hooks/use-toast';
import { mockStores, mockTasks as initialTasks } from '../data/mockData';

const TaskCreationPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>('diaria');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [delegable, setDelegable] = useState(true);
  const [extendable, setExtendable] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter stores based on search term
  const filteredStores = mockStores.filter(store =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
    store.city.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
    (store.state && store.state.toLowerCase().includes(storeSearchTerm.toLowerCase()))
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || selectedStores.length === 0 || !dueDate) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Create new task or update existing
    if (editingTaskId) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTaskId 
            ? {
                ...task,
                title,
                description,
                observations,
                storeId: selectedStores[0], // Just using the first store for this example
                dueDate: new Date(dueDate).toISOString(),
                frequency,
                priority,
                delegable,
                extendable,
              }
            : task
        )
      );
      
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
      });
    } else {
      // Create new tasks for each selected store
      const newTasks = selectedStores.map((storeId, index) => ({
        id: `new-${Date.now()}-${index}`,
        title,
        description,
        observations,
        priority,
        frequency,
        storeId,
        createdAt: new Date().toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        status: 'pendente' as const,
        delegable,
        extendable,
        owner: '1', // Default owner is store manager
        delegates: [],
      }));
      
      setTasks(prevTasks => [...prevTasks, ...newTasks]);
      
      toast({
        title: "Tarefa(s) criada(s)",
        description: `${newTasks.length} nova(s) tarefa(s) criada(s) com sucesso.`,
      });
    }
    
    // Reset form
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setObservations('');
    setSelectedStores([]);
    setDueDate('');
    setFrequency('diaria');
    setPriority('normal');
    setDelegable(true);
    setExtendable(true);
    setEditingTaskId(null);
  };

  // Load task data for editing
  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setObservations(taskToEdit.observations || '');
      setSelectedStores([taskToEdit.storeId]);
      
      // Convert ISO date to yyyy-MM-dd
      const dueDate = new Date(taskToEdit.dueDate);
      const year = dueDate.getFullYear();
      const month = String(dueDate.getMonth() + 1).padStart(2, '0');
      const day = String(dueDate.getDate()).padStart(2, '0');
      setDueDate(`${year}-${month}-${day}`);
      
      setFrequency(taskToEdit.frequency);
      setPriority(taskToEdit.priority);
      setDelegable(taskToEdit.delegable);
      setExtendable(taskToEdit.extendable);
      setEditingTaskId(taskId);
    }
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso.",
    });
    
    if (editingTaskId === taskId) {
      resetForm();
    }
  };

  // Toggle store selection
  const toggleStore = (storeId: string) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  // Get priority label
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent_important': return 'Urgente e Importante';
      case 'important': return 'Importante';
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  // Get store name by id
  const getStoreName = (storeId: string) => {
    const store = mockStores.find(store => store.id === storeId);
    return store ? store.name : 'Loja não encontrada';
  };

  return (
    <Layout title="Cadastro de Tarefas">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingTaskId ? 'Editar Tarefa' : 'Nova Tarefa'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição *
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição da tarefa"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
                  Observações/Instruções
                </label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Instruções detalhadas, frequência, responsáveis, etc."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione as Lojas *
                </label>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar lojas..."
                    className="pl-9"
                    value={storeSearchTerm}
                    onChange={(e) => setStoreSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {filteredStores.slice(0, 50).map((store) => (
                    <div key={store.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`store-${store.id}`}
                        checked={selectedStores.includes(store.id)}
                        onCheckedChange={() => toggleStore(store.id)}
                      />
                      <label
                        htmlFor={`store-${store.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {store.name} ({store.city}/{store.state})
                      </label>
                    </div>
                  ))}
                  {filteredStores.length > 50 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Mostrando 50 de {filteredStores.length} lojas. Use a busca para refinar.
                    </p>
                  )}
                </div>
                {selectedStores.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedStores.slice(0, 10).map(storeId => (
                      <Badge key={storeId} variant="outline" className="bg-primary/10">
                        {getStoreName(storeId)}
                      </Badge>
                    ))}
                    {selectedStores.length > 10 && (
                      <Badge variant="outline" className="bg-gray-100">
                        +{selectedStores.length - 10} lojas
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
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
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                    Frequência
                  </label>
                  <Select value={frequency} onValueChange={(value: TaskFrequency) => setFrequency(value)}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Prioridade (Matriz de Eisenhower)
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
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="delegable"
                    checked={delegable} 
                    onCheckedChange={(checked) => setDelegable(!!checked)} 
                  />
                  <label 
                    htmlFor="delegable"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tarefa delegável
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="extendable"
                    checked={extendable} 
                    onCheckedChange={(checked) => setExtendable(!!checked)} 
                  />
                  <label 
                    htmlFor="extendable"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Prazo prorrogável
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {editingTaskId ? 'Cancelar' : 'Limpar'}
                </Button>
                <Button type="submit">
                  {editingTaskId ? 'Atualizar Tarefa' : 'Cadastrar Tarefa'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tarefas Cadastradas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tarefas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{task.title}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 text-blue-500"
                          onClick={() => handleEditTask(task.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    
                    {task.observations && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <strong>Observações:</strong> {task.observations}
                      </div>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-primary/10">
                        {getStoreName(task.storeId)}
                      </Badge>
                      <Badge variant="outline" className="bg-secondary/10">
                        Frequência: {task.frequency}
                      </Badge>
                      <Badge variant="outline" className="bg-accent/10">
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      {task.delegable && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Delegável
                        </Badge>
                      )}
                      {task.extendable && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          Prorrogável
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>Nenhuma tarefa encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TaskCreationPage;
