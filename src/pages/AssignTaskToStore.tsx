
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockStores } from '../data/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const AssignTaskToStore: React.FC = () => {
  const { lojaId } = useParams<{ lojaId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const loja = mockStores.find(store => store.id === lojaId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    frequency: '',
    dueDate: '',
    owner: '',
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate task assignment
    toast({
      title: "Tarefa atribuída com sucesso",
      description: `Tarefa "${formData.title}" foi atribuída à loja ${loja?.name}.`,
    });
    
    navigate('/supervisor/lojas');
  };

  const handleBack = () => {
    navigate('/supervisor/lojas');
  };

  if (!loja) {
    return (
      <Layout title="Loja não encontrada">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Loja não encontrada</h1>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lojas
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Atribuir Tarefa - ${loja.name}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Atribuir Tarefa à Loja</h1>
            <p className="text-gray-600 mt-1">{loja.name} - {loja.city}, {loja.state}</p>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Tarefa</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent_important">Urgente e Importante</SelectItem>
                      <SelectItem value="important">Importante, Não Urgente</SelectItem>
                      <SelectItem value="urgent">Urgente, Não Importante</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Frequência</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                      <SelectItem value="pontual">Pontual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Data de Prazo</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="owner">Responsável (Dono)</Label>
                  <Select value={formData.owner} onValueChange={(value) => setFormData({...formData, owner: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                      <SelectItem value="Farmacêutico">Farmacêutico</SelectItem>
                      <SelectItem value="Atendente">Atendente</SelectItem>
                      <SelectItem value="Estoquista">Estoquista</SelectItem>
                      <SelectItem value="Operador de Caixa">Operador de Caixa</SelectItem>
                      <SelectItem value="Estagiário">Estagiário</SelectItem>
                      <SelectItem value="Vigilante">Vigilante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="observations">Observações/Instruções</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows={2}
                  placeholder="Informações adicionais sobre a execução da tarefa"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#118f55] hover:bg-[#0f7a47]">
                  <Save className="mr-2 h-4 w-4" />
                  Atribuir Tarefa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AssignTaskToStore;
