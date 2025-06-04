
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { mockUsers, mockTasks } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const TeamPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filtrar colaboradores da loja atual
  const storeEmployees = mockUsers.filter(user => 
    user.role === 'colaborador' && user.storeId === currentUser?.storeId
  );
  
  // Filtrar tarefas da loja atual
  const storeTasks = mockTasks.filter(task => task.storeId === currentUser?.storeId);

  const getEmployeeStats = (employeeId: string) => {
    const employeeTasks = storeTasks.filter(t => t.assignedTo === employeeId);
    return {
      total: employeeTasks.length,
      completed: employeeTasks.filter(t => t.status === 'concluida').length,
      inProgress: employeeTasks.filter(t => t.status === 'em_progresso').length,
      pending: employeeTasks.filter(t => t.status === 'pendente').length,
      delayed: employeeTasks.filter(t => t.status === 'atrasada').length,
      performance: employeeTasks.length > 0 ? Math.round((employeeTasks.filter(t => t.status === 'concluida').length / employeeTasks.length) * 100) : 0
    };
  };

  return (
    <Layout title="Equipe">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Gestão da Equipe
          </h2>
        </div>

        {/* Cards de visão geral */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeEmployees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {storeTasks.filter(t => t.status === 'pendente' || t.status === 'em_progresso').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {storeTasks.filter(t => t.status === 'concluida').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {storeTasks.filter(t => t.status === 'atrasada').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista detalhada dos colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Individual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeEmployees.map((employee) => {
                const stats = getEmployeeStats(employee.id);
                return (
                  <div key={employee.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{employee.name}</h3>
                        <p className="text-gray-600">{employee.position || 'Colaborador'}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{stats.performance}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${stats.performance >= 80 ? 'bg-green-500' : stats.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${stats.performance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-500">Total</div>
                        <div className="text-xl font-bold">{stats.total}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-500">Pendentes</div>
                        <div className="text-xl font-bold text-gray-600">{stats.pending}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-500">Em Progresso</div>
                        <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-500">Concluídas</div>
                        <div className="text-xl font-bold text-green-600">{stats.completed}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-500">Atrasadas</div>
                        <div className="text-xl font-bold text-red-600">{stats.delayed}</div>
                      </div>
                    </div>
                    
                    {stats.delayed > 0 && (
                      <div className="mt-3">
                        <Badge variant="destructive">
                          Atenção: {stats.delayed} tarefa(s) atrasada(s)
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {storeEmployees.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhum colaborador encontrado nesta loja.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamPage;
