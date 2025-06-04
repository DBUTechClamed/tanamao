
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { mockStores, mockTasks, mockUsers } from '../data/mockData';

const SupervisorStoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  const store = mockStores.find(s => s.id === storeId);
  const storeTasks = mockTasks.filter(task => task.storeId === storeId);
  const storeEmployees = mockUsers.filter(user => user.storeId === storeId && user.role === 'colaborador');
  
  const stats = {
    totalTasks: storeTasks.length,
    completed: storeTasks.filter(t => t.status === 'concluida').length,
    inProgress: storeTasks.filter(t => t.status === 'em_progresso').length,
    pending: storeTasks.filter(t => t.status === 'pendente').length,
    delayed: storeTasks.filter(t => t.status === 'atrasada').length,
  };

  const performance = stats.totalTasks > 0 ? Math.round((stats.completed / stats.totalTasks) * 100) : 0;

  if (!store) {
    return (
      <Layout title="Loja não encontrada">
        <div className="text-center">
          <p>Loja não encontrada.</p>
          <Button onClick={() => navigate('/supervisor/lojas')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista de Lojas
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Detalhes - ${store.name}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{store.name}</h2>
            <p className="text-gray-600">{store.city}</p>
          </div>
          <Button onClick={() => navigate('/supervisor/lojas')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${performance >= 80 ? 'bg-green-500' : performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${performance}%` }}
                ></div>
              </div>
              <span className="text-2xl font-bold">{performance}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Lista de colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores ({storeEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {storeEmployees.map((employee) => {
                const employeeTasks = storeTasks.filter(t => t.assignedTo === employee.id);
                const employeeCompleted = employeeTasks.filter(t => t.status === 'concluida').length;
                const employeePerformance = employeeTasks.length > 0 ? Math.round((employeeCompleted / employeeTasks.length) * 100) : 0;
                
                return (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.position || 'Colaborador'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Tarefas: {employeeTasks.length}</p>
                      <p className="text-sm">Performance: {employeePerformance}%</p>
                    </div>
                  </div>
                );
              })}
              {storeEmployees.length === 0 && (
                <p className="text-gray-500 text-center">Nenhum colaborador encontrado.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SupervisorStoreDetailPage;
