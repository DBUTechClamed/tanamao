
export type UserRole = 'gerente' | 'colaborador' | 'supervisor' | 'matriz_adm';

export type UserProfile = {
  id: string;
  name: string;
  role: UserRole;
  storeId?: string; // ID da loja (apenas para gerentes, colaboradores)
  regionId?: string; // ID da região (apenas para supervisores)
  position?: string; // Cargo específico (para colaboradores)
};

export type TaskPriority = 'urgent_important' | 'important' | 'urgent' | 'normal';

export type TaskFrequency = 'diaria' | 'semanal' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'pontual';

export type TaskStatus = 'pendente' | 'em_progresso' | 'concluida' | 'atrasada';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority; // Classificação na Matriz de Eisenhower
  frequency: TaskFrequency;
  storeId: string;
  createdAt: string;
  dueDate: string;
  status: TaskStatus;
  delegable: boolean; // Se pode ser delegada
  extendable: boolean; // Se o prazo pode ser prorrogado
  owner: string; // ID do responsável principal
  delegates: string[]; // IDs dos possíveis delegados
  assignedTo?: string; // ID do usuário atualmente designado
  startedBy?: string; // ID de quem iniciou
  startedAt?: string; 
  completedBy?: string; // ID de quem concluiu
  completedAt?: string;
};

export type Store = {
  id: string;
  name: string;
  regionId: string;
};

export type Region = {
  id: string;
  name: string;
};

export type UserStats = {
  userId: string;
  userName: string;
  tasksAssigned: number;
  tasksStarted: number;
  tasksCompleted: number;
  tasksDelayed: number;
  performance: number; // 0-100%
};

export type StoreStats = {
  storeId: string;
  storeName: string;
  tasksTotal: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  tasksDelayed: number;
  performance: number; // 0-100%
};
