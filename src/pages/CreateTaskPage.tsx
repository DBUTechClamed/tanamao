
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { mockStores } from '../data/mockData';
import { Save, ArrowLeft } from 'lucide-react';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    rotina: '',
    frequency: '',
    programmable: false,
    extendable: false,
    delegable: false,
    priority: '',
    owner: '',
    delegate1: '',
    delegate2: '',
    delegate3: '',
    dueDate: '',
    observations: '',
    selectedStores: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate task creation
    toast({
      title: "Tarefa cadastrada com sucesso!",
      description: `Tarefa "${formData.title}" foi criada e atribuída a ${formData.selectedStores.length} loja(s).`,
    });
    
    navigate('/admin');
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const handleStoreSelection = (storeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStores: prev.selectedStores.includes(storeId)
        ? prev.selectedStores.filter(id => id !== storeId)
        : [...prev.selectedStores, storeId]
    }));
  };

  const selectAllStores = () => {
    setFormData(prev => ({
      ...prev,
      selectedStores: mockStores.map(store => store.id)
    }));
  };

  const clearAllStores = () => {
    setFormData(prev => ({
      ...prev,
      selectedStores: []
    }));
  };

  return (
    <Layout title="Cadastrar Nova Tarefa">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cadastrar Nova Tarefa</h1>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título (Trabalho)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="area">Área</Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estoque">Estoque</SelectItem>
                      <SelectItem value="precificacao">Precificação</SelectItem>
                      <SelectItem value="merchandising">Merchandising</SelectItem>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="farmacia">Farmácia</SelectItem>
                      <SelectItem value="administracao">Administração</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                      <SelectItem value="seguranca">Segurança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rotina">Rotina</Label>
                  <Select value={formData.rotina} onValueChange={(value) => setFormData({...formData, rotina: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a rotina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estoque">Estoque</SelectItem>
                      <SelectItem value="gerencial">Gerencial</SelectItem>
                      <SelectItem value="merchandising">Merchandising</SelectItem>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="administrativa">Administrativa</SelectItem>
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
                      <SelectItem value="bimestral">Bimestral</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                      <SelectItem value="pontual">Pontual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent_important">Urg. & Imp.</SelectItem>
                      <SelectItem value="important">Imp. sem Urg.</SelectItem>
                      <SelectItem value="urgent">Urg. sem Imp.</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
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
              </div>

              {/* Description */}
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

              {/* Switches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="programmable"
                    checked={formData.programmable}
                    onCheckedChange={(checked) => setFormData({...formData, programmable: checked})}
                  />
                  <Label htmlFor="programmable">Programável</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="extendable"
                    checked={formData.extendable}
                    onCheckedChange={(checked) => setFormData({...formData, extendable: checked})}
                  />
                  <Label htmlFor="extendable">Prorrogável</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="delegable"
                    checked={formData.delegable}
                    onCheckedChange={(checked) => setFormData({...formData, delegable: checked})}
                  />
                  <Label htmlFor="delegable">Delegável</Label>
                </div>
              </div>

              {/* Responsibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Dono</Label>
                  <Select value={formData.owner} onValueChange={(value) => setFormData({...formData, owner: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dono" />
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

                <div>
                  <Label htmlFor="delegate1">Delegado 1</Label>
                  <Select value={formData.delegate1} onValueChange={(value) => setFormData({...formData, delegate1: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione delegado 1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
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

                <div>
                  <Label htmlFor="delegate2">Delegado 2</Label>
                  <Select value={formData.delegate2} onValueChange={(value) => setFormData({...formData, delegate2: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione delegado 2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
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

                <div>
                  <Label htmlFor="delegate3">Delegado 3</Label>
                  <Select value={formData.delegate3} onValueChange={(value) => setFormData({...formData, delegate3: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione delegado 3" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
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

              {/* Observations */}
              <div>
                <Label htmlFor="observations">Observações/Instruções</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows={3}
                  placeholder="Informações adicionais sobre a execução da tarefa"
                />
              </div>

              {/* Store Selection */}
              <div>
                <Label>Lista de Lojas</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllStores}>
                      Selecionar Todas
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={clearAllStores}>
                      Limpar Seleção
                    </Button>
                    <span className="text-sm text-gray-600 self-center">
                      {formData.selectedStores.length} de {mockStores.length} lojas selecionadas
                    </span>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                    {mockStores.slice(0, 20).map((store) => (
                      <div key={store.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`store-${store.id}`}
                          checked={formData.selectedStores.includes(store.id)}
                          onChange={() => handleStoreSelection(store.id)}
                          className="rounded"
                        />
                        <label htmlFor={`store-${store.id}`} className="text-sm">
                          {store.name} - {store.city}, {store.state}
                        </label>
                      </div>
                    ))}
                    {mockStores.length > 20 && (
                      <div className="text-xs text-gray-500 pt-2">
                        ... e mais {mockStores.length - 20} lojas
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#118f55] hover:bg-[#0f7a47]">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Tarefa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateTaskPage;
