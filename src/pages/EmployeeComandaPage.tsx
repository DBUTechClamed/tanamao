
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockTasks, mockStores, mockUsers } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';

const EmployeeComandaPage: React.FC = () => {
  const { colaboradorId } = useParams<{ colaboradorId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const colaborador = mockUsers.find(user => user.id === colaboradorId);
  const loja = mockStores.find(store => store.id === currentUser?.storeId);
  const dataEmissao = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
  
  // Filtrar tarefas do colaborador específico
  const tarefasColaborador = mockTasks.filter(task => 
    task.assignedTo === colaboradorId && 
    task.storeId === currentUser?.storeId &&
    task.status !== 'concluida'
  ).sort((a, b) => {
    const priorityOrder = {
      'urgent_important': 0,
      'urgent': 1,
      'important': 2,
      'normal': 3
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/gerente/equipe');
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

  if (!colaborador) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Colaborador não encontrado</h1>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Botões de ação - escondidos na impressão */}
      <div className="no-print flex justify-between p-4 bg-[#118f55] text-white">
        <Button onClick={handleBack} variant="ghost" className="text-white hover:bg-green-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handlePrint} variant="ghost" className="text-white hover:bg-green-600">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Conteúdo da comanda */}
      <div className="comanda-content p-4 max-w-md mx-auto">
        <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.2' }}>
          {/* Cabeçalho */}
          <div className="text-center mb-4">
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              TÁ NA MÃO - COMANDA DE TAREFAS
            </div>
            <div style={{ borderTop: '1px solid #000', margin: '8px 0' }}></div>
            <div style={{ marginBottom: '4px' }}>
              Loja: {loja?.name || 'N/A'} - {loja?.city || 'N/A'}
            </div>
            <div style={{ marginBottom: '8px' }}>
              Data: {dataEmissao} Colaborador: {colaborador.name}
            </div>
            <div style={{ borderTop: '1px solid #000', margin: '8px 0' }}></div>
          </div>

          {/* Lista de tarefas */}
          <div className="mb-4">
            {tarefasColaborador.map((task, index) => (
              <div key={task.id} style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '2px' }}>
                  <strong>{task.status === 'concluida' ? '[x]' : '[ ]'} {task.title}</strong>
                </div>
                {task.description && (
                  <div style={{ marginLeft: '16px', marginBottom: '2px' }}>
                    – {task.description}
                  </div>
                )}
                {task.observations && (
                  <div style={{ marginLeft: '16px', marginBottom: '2px', fontStyle: 'italic', fontSize: '11px' }}>
                    Obs: {task.observations}
                  </div>
                )}
                <div style={{ marginLeft: '16px', fontSize: '11px' }}>
                  Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')} 
                  {' '}Freq: {getFrequenciaText(task.frequency)} 
                  {' '}[{getPrioridadeText(task.priority)}]
                </div>
              </div>
            ))}
            
            {tarefasColaborador.length === 0 && (
              <div className="text-center" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                Nenhuma tarefa pendente encontrada para este colaborador.
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div>
            <div style={{ borderTop: '1px solid #000', margin: '8px 0' }}></div>
            <div style={{ marginBottom: '12px' }}>
              Assinatura do Colaborador: __________________
            </div>
            <div style={{ borderTop: '1px solid #000', margin: '8px 0' }}></div>
            <div style={{ fontSize: '11px' }}>
              Gerente responsável: {currentUser?.name || 'N/A'}
            </div>
            <div style={{ borderTop: '1px solid #000', margin: '8px 0' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body, html { 
            margin: 0; 
            padding: 0; 
          }
          .no-print { 
            display: none !important; 
          }
          .comanda-content { 
            width: 300px; 
            font-size: 10px;
            margin: 0;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeComandaPage;
