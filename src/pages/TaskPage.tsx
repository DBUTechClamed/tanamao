
import React, { useState } from 'react';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Tarefas de exemplo
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Conferência de Estoque de Medicamentos',
    description: 'Verificar o estoque de todos os medicamentos controlados e atualizar no sistema.',
    priority: 'urgent_important',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'pendente',
    delegable: true,
    extendable: false,
    owner: '1', // Gerente
    delegates: ['2', '4'], // Farmacêutico, Estoquista
  },
  {
    id: '2',
    title: 'Revisão de Validades',
    description: 'Verificar produtos próximos ao vencimento e organizar para promoção ou devolução.',
    priority: 'important',
    frequency: 'semanal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-07T17:00:00.000Z',
    status: 'pendente',
    delegable: true,
    extendable: true,
    owner: '1', // Gerente
    delegates: ['3', '4'], // Atendente, Estoquista
  },
  {
    id: '3',
    title: 'Limpeza da Área de Atendimento',
    description: 'Realizar limpeza completa da área de atendimento ao cliente.',
    priority: 'normal',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T17:00:00.000Z',
    status: 'em_progresso',
    delegable: true,
    extendable: false,
    owner: '3', // Atendente
    delegates: [],
    assignedTo: '3',
    startedBy: '3',
    startedAt: '2023-05-01T09:30:00.000Z',
  },
  {
    id: '4',
    title: 'Relatório de Vendas Semanal',
    description: 'Preparar o relatório de vendas da semana anterior e enviar para matriz.',
    priority: 'urgent',
    frequency: 'semanal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-02T12:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: true,
    owner: '1', // Gerente
    delegates: [],
  },
  {
    id: '5',
    title: 'Treinamento de Atendimento',
    description: 'Realizar treinamento de atendimento ao cliente com equipe de balcão.',
    priority: 'important',
    frequency: 'mensal',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-15T17:00:00.000Z',
    status: 'pendente',
    delegable: true,
    extendable: true,
    owner: '1', // Gerente
    delegates: ['2'], // Farmacêutico
  },
  {
    id: '6',
    title: 'Contagem de Caixa',
    description: 'Realizar contagem e fechamento do caixa diário.',
    priority: 'urgent_important',
    frequency: 'diaria',
    storeId: '1',
    createdAt: '2023-05-01T08:00:00.000Z',
    dueDate: '2023-05-01T18:00:00.000Z',
    status: 'pendente',
    delegable: false,
    extendable: false,
    owner: '1', // Gerente
    delegates: [],
  }
];

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  const handleStartTask = (taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'em_progresso', 
              startedBy: '1', // ID do gerente 
              startedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  };
  
  const handleCompleteTask = (taskId: string) => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setTasks(currentTasks => 
          currentTasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: 'concluida', 
                  completedBy: '1', // ID do gerente 
                  completedAt: new Date().toISOString() 
                } 
              : task
          )
        );
        
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
  };
  
  const handleDelegateTask = (taskId: string) => {
    // Navigate to delegate page
  };

  return (
    <Layout title="Tarefas">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList 
            tasks={tasks} 
            onStart={handleStartTask}
            onComplete={handleCompleteTask}
            onDelegate={handleDelegateTask}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TaskPage;
