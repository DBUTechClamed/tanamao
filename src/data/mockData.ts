
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus, TaskFrequency, UserProfile, Store, Region } from '../types';

// IDs dos colaboradores (definidos em collaboratorsMock)
const colaboradores = ["colab1", "colab2", "colab3", "colab4", "colab5", "colab6"];

// Função auxiliar para gerar data de prazo aleatória dentro dos próximos 7 dias
function gerarDataAleatoria(): string {
  const hoje = new Date();
  const dias = Math.floor(Math.random() * 7); // 0 a 6 dias
  const dataFutura = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias);
  return dataFutura.toISOString();
}

// Array de títulos de exemplo (servem para compor tarefas diferentes)
const titulosExemplo = [
  "Receber Mercadoria do CD",
  "Conferir Estoque Geral",
  "Alterar Preço de Promoção",
  "Limpar Prateleiras (Infantil)",
  "Conferir Vencimento de Controlados",
  "Organizar Gôndolas de Vingente",
  "Realizar Sangria de Caixa",
  "Atualizar Planograma",
  "Registrar Temperatura de Geladeira",
  "Emitir Relatório de Estoque",
  "Abertura de Caixa",
  "Atendimento ao Cliente VIP",
  "Revisar Planilha de Limpeza",
  "Fazer Backup de Dados PDV",
  "Divulgar Promoção nas Redes",
  "Cadastrar Novo Produto",
  "Realizar Treinamento Interno",
  "Conferir Notas Fiscais",
  "Configurar Termômetro do Freezer",
  "Revisar Indicadores Mensais"
];

// Frequências de exemplo
const frequencias: TaskFrequency[] = [
  "diaria",
  "semanal",
  "quinzenal",
  "mensal",
  "trimestral",
  "semestral",
  "anual",
  "pontual"
];

// Prioridades válidas conforme o tipo
const prioridadesValidas = ["urgent_important", "important", "urgent", "normal"] as const;

// Gerar uma tarefa totalmente nova (sem assignedTo)
function gerarTarefaSemResponsavel(): Task {
  const titulo = titulosExemplo[Math.floor(Math.random() * titulosExemplo.length)];
  const prioridade = prioridadesValidas[Math.floor(Math.random() * prioridadesValidas.length)];
  const frequencia = frequencias[Math.floor(Math.random() * frequencias.length)];
  
  return {
    id: uuidv4(),
    title: titulo,
    description: `Descrição para: ${titulo}`,
    priority: prioridade,
    frequency: frequencia,
    storeId: "loja1",
    createdAt: new Date().toISOString(),
    dueDate: gerarDataAleatoria(),
    status: "pendente",
    delegable: true,
    extendable: Math.random() < 0.5,
    owner: "gerente1",
    delegates: ["colab1", "colab2", "colab3"],
    assignedTo: undefined
  };
}

// Gerar uma tarefa atribuída a um colaborador específico
function gerarTarefaParaColaborador(colabId: string): Task {
  const titulo = titulosExemplo[Math.floor(Math.random() * titulosExemplo.length)];
  const prioridade = prioridadesValidas[Math.floor(Math.random() * prioridadesValidas.length)];
  const frequencia = frequencias[Math.floor(Math.random() * frequencias.length)];

  // Determinar status aleatório (30% concluída, 20% em_progresso, 50% pendente)
  const rand = Math.random();
  const status: TaskStatus = rand < 0.3 ? "concluida" : rand < 0.5 ? "em_progresso" : "pendente";

  return {
    id: uuidv4(),
    title: titulo,
    description: `Descrição para: ${titulo}`,
    priority: prioridade,
    frequency: frequencia,
    storeId: "loja1",
    createdAt: new Date().toISOString(),
    dueDate: gerarDataAleatoria(),
    status,
    delegable: true,
    extendable: Math.random() < 0.5,
    owner: "gerente1",
    delegates: ["colab1", "colab2", "colab3"],
    assignedTo: colabId
  };
}

// Agora, construir o array completo de tasksMock
export const mockTasks: Task[] = [
  // 10 tarefas sem responsável (a serem atribuídas pelo Gerente)
  ...Array.from({ length: 10 }, () => gerarTarefaSemResponsavel()),

  // Para cada colaborador, gerar 3 tarefas atribuídas
  ...colaboradores.flatMap((colabId) =>
    Array.from({ length: 3 }, () => gerarTarefaParaColaborador(colabId))
  )
];

// Mock users data
export const mockUsers: UserProfile[] = [
  {
    id: "gerente1",
    name: "João Silva",
    role: "gerente",
    storeId: "loja1"
  },
  {
    id: "colab1",
    name: "Maria Oliveira",
    role: "colaborador",
    storeId: "loja1",
    position: "farmacêutico"
  },
  {
    id: "colab2",
    name: "Pedro Santos",
    role: "colaborador",
    storeId: "loja1",
    position: "atendente"
  },
  {
    id: "colab3",
    name: "Ana Costa",
    role: "colaborador",
    storeId: "loja1",
    position: "estoquista"
  },
  {
    id: "colab4",
    name: "Roberto Alves",
    role: "colaborador",
    storeId: "loja1",
    position: "operador de caixa"
  },
  {
    id: "colab5",
    name: "Júlia Pereira",
    role: "colaborador",
    storeId: "loja1",
    position: "estagiário"
  },
  {
    id: "colab6",
    name: "Marcos Rodrigues",
    role: "colaborador",
    storeId: "loja1",
    position: "vigilante"
  },
  {
    id: "supervisor1",
    name: "Carlos Souza",
    role: "supervisor",
    regionId: "regiao1"
  },
  {
    id: "admin1",
    name: "Fernanda Lima",
    role: "matriz_adm"
  }
];

// Mock stores data
export const mockStores: Store[] = [
  {
    id: "loja1",
    name: "Farmácia Central",
    city: "São Paulo",
    state: "SP",
    regionId: "regiao1"
  },
  {
    id: "loja2",
    name: "Farmácia Norte",
    city: "Guarulhos",
    state: "SP",
    regionId: "regiao1"
  },
  {
    id: "loja3",
    name: "Farmácia Sul",
    city: "São Bernardo",
    state: "SP",
    regionId: "regiao1"
  }
];

// Mock regions data
export const mockRegions: Region[] = [
  {
    id: "regiao1",
    name: "Grande São Paulo"
  }
];
