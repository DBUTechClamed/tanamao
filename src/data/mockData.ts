
import { Task, UserProfile, Store, Region, TaskFrequency, TaskPriority } from '../types';

export const mockRegions: Region[] = [
  { id: '1', name: 'Região Sul' },
  { id: '2', name: 'Região Sudeste' },
  { id: '3', name: 'Região Centro-Oeste' },
];

export const mockStores: Store[] = [
  { id: '1', name: 'Filial 001 - Centro', city: 'Curitiba', state: 'PR', regionId: '1' },
  { id: '2', name: 'Filial 002 - Rebouças', city: 'Curitiba', state: 'PR', regionId: '1' },
  { id: '3', name: 'Filial 003 - Portão', city: 'Curitiba', state: 'PR', regionId: '1' },
  { id: '4', name: 'Filial 004 - Batel', city: 'Curitiba', state: 'PR', regionId: '1' },
  { id: '5', name: 'Filial 005 - Barreirinha', city: 'Londrina', state: 'PR', regionId: '1' },
  // Add more stores to reach 300 total...
  ...Array.from({ length: 295 }, (_, i) => ({
    id: `${i + 6}`,
    name: `Filial ${String(i + 6).padStart(3, '0')} - ${['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'][i % 5]}`,
    city: ['Curitiba', 'Londrina', 'Maringá', 'Cascavel', 'Ponta Grossa', 'Florianópolis', 'Joinville', 'Blumenau', 'Campo Grande', 'Dourados', 'Porto Alegre', 'Caxias do Sul'][i % 12],
    state: ['PR', 'SC', 'MS', 'RS'][i % 4],
    regionId: ['1', '2', '3'][i % 3]
  }))
];

export const mockUsers: UserProfile[] = [
  // Gerente
  { id: '1', name: 'Carlos Silva', role: 'gerente', storeId: '1' },
  
  // Colaboradores da loja 1
  { id: '2', name: 'Maria Oliveira', role: 'colaborador', storeId: '1', position: 'Farmacêutica' },
  { id: '3', name: 'Pedro Santos', role: 'colaborador', storeId: '1', position: 'Atendente' },
  { id: '4', name: 'Ana Costa', role: 'colaborador', storeId: '1', position: 'Estoquista' },
  { id: '5', name: 'Roberto Alves', role: 'colaborador', storeId: '1', position: 'Operador de Caixa' },
  { id: '6', name: 'Júlia Pereira', role: 'colaborador', storeId: '1', position: 'Estagiária' },
  { id: '7', name: 'Marcos Rodrigues', role: 'colaborador', storeId: '1', position: 'Vigilante' },
  
  // Supervisor
  { id: '8', name: 'Fernando Costa', role: 'supervisor', regionId: '1' },
  
  // Matriz ADM
  { id: '9', name: 'Admin Sistema', role: 'matriz_adm' },
];

// 5 example tasks to be distributed among employees
const taskTemplates = [
  {
    title: 'Recebimento de Mercadorias do CD',
    description: 'Receber, conferir e armazenar mercadorias vindas do centro de distribuição.',
    priority: 'urgent_important' as TaskPriority,
    frequency: 'diaria' as TaskFrequency,
    programmable: false,
    extendable: false,
    delegable: true,
    owner: 'Estoquista',
    delegate1: 'Atendente',
    delegate2: 'Farmacêutico',
    delegate3: 'Gerente',
    dueDate: '2025-01-01'
  },
  {
    title: 'Análise de Estoque (Diária)',
    description: 'Realizar análise diária dos níveis de estoque e identificar necessidades de reposição.',
    priority: 'urgent_important' as TaskPriority,
    frequency: 'diaria' as TaskFrequency,
    programmable: true,
    extendable: false,
    delegable: true,
    owner: 'Gerente',
    delegate1: 'Farmacêutico',
    delegate2: '',
    delegate3: '',
    dueDate: '2025-01-01'
  },
  {
    title: 'Alteração de Preço',
    description: 'Atualizar preços de produtos conforme orientações da matriz.',
    priority: 'urgent_important' as TaskPriority,
    frequency: 'diaria' as TaskFrequency,
    programmable: true,
    extendable: false,
    delegable: true,
    owner: 'Atendente',
    delegate1: 'Estagiário',
    delegate2: 'Farmacêutico',
    delegate3: 'Gerente',
    dueDate: '2025-01-01'
  },
  {
    title: 'Limpeza de Prateleiras (Infantil)',
    description: 'Realizar limpeza completa e organizar prateleiras do setor infantil.',
    priority: 'normal' as TaskPriority,
    frequency: 'diaria' as TaskFrequency,
    programmable: false,
    extendable: true,
    delegable: true,
    owner: 'Atendente',
    delegate1: 'Estagiário',
    delegate2: '',
    delegate3: '',
    dueDate: '2025-01-02'
  },
  {
    title: 'Conferência de Vencimentos de Medicamentos Controlados',
    description: 'Verificar produtos próximos ao vencimento e separar para devolução.',
    priority: 'important' as TaskPriority,
    frequency: 'semanal' as TaskFrequency,
    programmable: true,
    extendable: true,
    delegable: true,
    owner: 'Farmacêutico',
    delegate1: 'Gerente',
    delegate2: '',
    delegate3: '',
    dueDate: '2025-01-05'
  }
];

// Task distribution for each employee
const taskDistribution = {
  '2': [0, 2, 4], // Maria Oliveira: Recebimento, Alteração de Preço, Conferência
  '3': [3, 2, 0], // Pedro Santos: Limpeza, Alteração de Preço, Recebimento
  '4': [0, 1, 3], // Ana Costa: Recebimento, Análise de Estoque, Limpeza
  '5': [3, 2, 4], // Roberto Alves: Limpeza, Alteração de Preço, Conferência
  '6': [2, 3, 1], // Júlia Pereira: Alteração de Preço, Limpeza, Análise de Estoque
  '7': [3, 4, 0], // Marcos Rodrigues: Limpeza, Conferência, Recebimento
};

export const mockTasks: Task[] = [];

// Generate tasks for each employee
Object.entries(taskDistribution).forEach(([employeeId, taskIndexes]) => {
  taskIndexes.forEach((templateIndex, index) => {
    const template = taskTemplates[templateIndex];
    const task: Task = {
      id: `task-${employeeId}-${index + 1}`,
      title: template.title,
      description: template.description,
      observations: `Freq: ${template.frequency}, Programável: ${template.programmable ? 'Sim' : 'Não'}, Prorrogável: ${template.extendable ? 'Sim' : 'Não'}, Delegável: ${template.delegable ? 'Sim' : 'Não'}, Dono: ${template.owner}, Delegado1: ${template.delegate1}, Delegado2: ${template.delegate2}, Delegado3: ${template.delegate3}`,
      priority: template.priority,
      frequency: template.frequency,
      storeId: '1', // All tasks for store 1
      createdAt: new Date().toISOString(),
      dueDate: template.dueDate,
      status: 'pendente',
      delegable: template.delegable,
      extendable: template.extendable,
      owner: '1', // Gerente is the owner
      delegates: ['2', '3', '4', '5', '6', '7'], // All employees can be delegates
      assignedTo: employeeId, // Assigned to specific employee
    };
    mockTasks.push(task);
  });
});

// Add some additional unassigned tasks for the manager
const additionalTasks: Task[] = [
  {
    id: 'task-unassigned-1',
    title: 'Supervisão Geral da Loja',
    description: 'Coordenar atividades gerais e monitorar desempenho da equipe.',
    observations: 'Freq: diária, Programável: Sim, Prorrogável: Não, Delegável: Não, Dono: Gerente',
    priority: 'important',
    frequency: 'diaria',
    storeId: '1',
    createdAt: new Date().toISOString(),
    dueDate: '2025-01-01',
    status: 'pendente',
    delegable: false,
    extendable: false,
    owner: '1',
    delegates: [],
    assignedTo: '1', // Assigned to manager
  },
  {
    id: 'task-unassigned-2',
    title: 'Reunião de Equipe Semanal',
    description: 'Conduzir reunião semanal com toda a equipe para alinhamentos.',
    observations: 'Freq: semanal, Programável: Sim, Prorrogável: Sim, Delegável: Não, Dono: Gerente',
    priority: 'important',
    frequency: 'semanal',
    storeId: '1',
    createdAt: new Date().toISOString(),
    dueDate: '2025-01-03',
    status: 'pendente',
    delegable: false,
    extendable: true,
    owner: '1',
    delegates: [],
    assignedTo: '1', // Assigned to manager
  }
];

mockTasks.push(...additionalTasks);
