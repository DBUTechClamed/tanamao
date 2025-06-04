
import React from 'react';
import { X, Printer } from 'lucide-react';
import { Task, UserProfile } from '../types';
import { mockStores } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PaginaComandaProps {
  colaborador: UserProfile;
  gerente: UserProfile;
  tasks: Task[];
  onClose: () => void;
}

const PaginaComanda: React.FC<PaginaComandaProps> = ({ colaborador, gerente, tasks, onClose }) => {
  const loja = mockStores.find(store => store.id === colaborador.storeId);
  const dataEmissao = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
  
  // Filtrar tarefas do colaborador que não estão concluídas
  const tarefasPendentes = tasks.filter(task => 
    task.assignedTo === colaborador.id && 
    task.storeId === colaborador.storeId && 
    task.status !== 'concluida'
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handlePrint = () => {
    window.print();
  };

  const getPrioridadeText = (priority: string) => {
    switch (priority) {
      case 'urgent_important': return 'Urgente e Importante';
      case 'important': return 'Importante, Não Urgente';
      case 'urgent': return 'Urgente, Não Importante';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  const getFrequenciaText = (frequency: string) => {
    switch (frequency) {
      case 'diaria': return 'Diária';
      case 'semanal': return 'Semanal';
      case 'mensal': return 'Mensal';
      case 'bimestral': return 'Bimestral';
      case 'trimestral': return 'Trimestral';
      case 'semestral': return 'Semestral';
      case 'anual': return 'Anual';
      case 'pontual': return 'Pontual';
      case 'quinzenal': return 'Quinzenal';
      default: return frequency;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg comanda-container">
        {/* Botões do modal */}
        <div className="flex justify-end p-2 no-print">
          <button
            onClick={handlePrint}
            className="mr-2 p-2 text-[#118f55] hover:bg-gray-100 rounded"
            title="Imprimir"
          >
            <Printer size={24} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-black hover:bg-gray-100 rounded"
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo da comanda */}
        <div className="p-4" style={{ fontFamily: 'Courier New, monospace', fontSize: '10px', maxWidth: '300px', margin: '0 auto' }}>
          {/* Cabeçalho */}
          <div className="text-center mb-4">
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              TáNaMão
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              COMANDA DE TAREFAS
            </div>
            <div style={{ fontSize: '10px', marginBottom: '4px' }}>
              Loja: {loja?.name || 'N/A'}
            </div>
            <div style={{ fontSize: '10px', marginBottom: '8px' }}>
              Data de Emissão: {dataEmissao}    Colaborador: {colaborador.name}
            </div>
            <hr style={{ border: '1px solid #000', margin: '4px 0' }} />
          </div>

          {/* Lista de tarefas */}
          <div className="mb-4">
            {tarefasPendentes.map((task, index) => (
              <div key={task.id} style={{ marginBottom: '8px' }}>
                <div style={{ marginBottom: '2px' }}>
                  [ ] {task.title}
                </div>
                {task.description && (
                  <div style={{ marginLeft: '16px', marginBottom: '2px' }}>
                    – {task.description}
                  </div>
                )}
                <div style={{ marginLeft: '16px', fontSize: '9px' }}>
                  Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')}    
                  Freq: {getFrequenciaText(task.frequency)}    
                  Prioridade: {getPrioridadeText(task.priority)}
                </div>
                {index < tarefasPendentes.length - 1 && (
                  <div style={{ height: '4px' }}></div>
                )}
              </div>
            ))}
            
            {tarefasPendentes.length === 0 && (
              <div className="text-center" style={{ fontSize: '10px', fontStyle: 'italic' }}>
                Nenhuma tarefa pendente encontrada.
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div>
            <hr style={{ border: '1px solid #000', margin: '4px 0' }} />
            <div style={{ fontSize: '10px', marginBottom: '8px' }}>
              Assinatura do Colaborador: _________________________
            </div>
            <div style={{ fontSize: '8px', fontStyle: 'italic' }}>
              Gerente responsável: {gerente.name}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body, html { 
            margin: 0; 
            padding: 0; 
          }
          .btn, .no-print { 
            display: none !important; 
          }
          .comanda-container { 
            width: 300px; 
            font-size: 10px;
            box-shadow: none;
            border: none;
          }
          .fixed {
            position: static;
          }
          .bg-black {
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginaComanda;
