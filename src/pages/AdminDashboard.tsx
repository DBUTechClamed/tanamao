
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Building, Clipboard, ClipboardCheck, AlertCircle } from 'lucide-react';

// Dados de exemplo para os gráficos
const taskCompletionData = [
  { name: 'Dom', concluidas: 15, atrasadas: 2 },
  { name: 'Seg', concluidas: 32, atrasadas: 1 },
  { name: 'Ter', concluidas: 30, atrasadas: 3 },
  { name: 'Qua', concluidas: 35, atrasadas: 2 },
  { name: 'Qui', concluidas: 28, atrasadas: 4 },
  { name: 'Sex', concluidas: 25, atrasadas: 1 },
  { name: 'Sáb', concluidas: 20, atrasadas: 0 },
];

const tasksByFrequencyData = [
  { name: 'Diárias', quantidade: 45 },
  { name: 'Semanais', quantidade: 32 },
  { name: 'Mensais', quantidade: 18 },
  { name: 'Quinzenais', quantidade: 10 },
  { name: 'Trimestrais', quantidade: 8 },
  { name: 'Semestrais', quantidade: 6 },
  { name: 'Anuais', quantidade: 4 },
  { name: 'Pontuais', quantidade: 15 },
];

const tasksByPriorityData = [
  { name: 'Urgente e Importante', quantidade: 35 },
  { name: 'Importante', quantidade: 40 },
  { name: 'Urgente', quantidade: 25 },
  { name: 'Normal', quantidade: 38 },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Estatísticas gerais
  const totalTasks = 138;
  const completedTasks = 103;
  const storesCount = 15;
  const delayedTasks = 8;

  return (
    <Layout title="Dashboard Administrativo">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lojas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => navigate('/admin/cadastrar-tarefa')} className="mb-4">
          Cadastrar Nova Tarefa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conclusão de Tarefas (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={taskCompletionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="concluidas" stroke="#3B82F6" name="Concluídas" />
                  <Line type="monotone" dataKey="atrasadas" stroke="#EF4444" name="Atrasadas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Frequência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tasksByFrequencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Tarefas por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tasksByPriorityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" name="Quantidade">
                    {tasksByPriorityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index === 0 ? '#EF4444' : // Urgente e Importante
                          index === 1 ? '#1E40AF' : // Importante
                          index === 2 ? '#FBBF24' : // Urgente
                          '#6B7280' // Normal
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
