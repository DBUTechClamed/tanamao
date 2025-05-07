
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { StoreStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dados de exemplo para as lojas
const mockStores: StoreStats[] = [
  { 
    storeId: '1', 
    storeName: 'Farmácia Centro', 
    storeCity: 'São Paulo',
    tasksTotal: 45, 
    tasksCompleted: 32, 
    tasksInProgress: 8, 
    tasksPending: 3, 
    tasksDelayed: 2, 
    performance: 71 
  },
  { 
    storeId: '2', 
    storeName: 'Farmácia Shopping', 
    storeCity: 'São Paulo',
    tasksTotal: 38, 
    tasksCompleted: 30, 
    tasksInProgress: 5, 
    tasksPending: 2, 
    tasksDelayed: 1, 
    performance: 79 
  },
  { 
    storeId: '3', 
    storeName: 'Farmácia Norte', 
    storeCity: 'Campinas',
    tasksTotal: 42, 
    tasksCompleted: 25, 
    tasksInProgress: 10, 
    tasksPending: 4, 
    tasksDelayed: 3, 
    performance: 60 
  },
  { 
    storeId: '4', 
    storeName: 'Farmácia Sul', 
    storeCity: 'Campinas',
    tasksTotal: 36, 
    tasksCompleted: 32, 
    tasksInProgress: 2, 
    tasksPending: 2, 
    tasksDelayed: 0, 
    performance: 89 
  },
  { 
    storeId: '5', 
    storeName: 'Farmácia Oeste', 
    storeCity: 'Ribeirão Preto',
    tasksTotal: 40, 
    tasksCompleted: 35, 
    tasksInProgress: 3, 
    tasksPending: 1, 
    tasksDelayed: 1, 
    performance: 88 
  },
  { 
    storeId: '6', 
    storeName: 'Farmácia Leste', 
    storeCity: 'Santos',
    tasksTotal: 38, 
    tasksCompleted: 20, 
    tasksInProgress: 10, 
    tasksPending: 6, 
    tasksDelayed: 2, 
    performance: 53 
  },
  { 
    storeId: '7', 
    storeName: 'Farmácia Central', 
    storeCity: 'Santos',
    tasksTotal: 44, 
    tasksCompleted: 38, 
    tasksInProgress: 4, 
    tasksPending: 2, 
    tasksDelayed: 0, 
    performance: 86 
  },
  { 
    storeId: '8', 
    storeName: 'Farmácia Plaza', 
    storeCity: 'São José dos Campos',
    tasksTotal: 39, 
    tasksCompleted: 28, 
    tasksInProgress: 7, 
    tasksPending: 3, 
    tasksDelayed: 1, 
    performance: 72 
  }
];

const StoreListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('todas');
  const [performanceFilter, setPerformanceFilter] = useState<string>('todas');

  // Extract unique cities for filter
  const cities = Array.from(new Set(mockStores.map(store => store.storeCity)));

  // Filter stores based on search term and filters
  const filteredStores = mockStores.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.storeCity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === 'todas' || store.storeCity === cityFilter;
    
    const matchesPerformance = performanceFilter === 'todas' ||
                              (performanceFilter === 'alta' && store.performance >= 80) ||
                              (performanceFilter === 'media' && store.performance >= 60 && store.performance < 80) ||
                              (performanceFilter === 'baixa' && store.performance < 60);
    
    return matchesSearch && matchesCity && matchesPerformance;
  });

  return (
    <Layout title="Lojas">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar lojas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={cityFilter}
            onValueChange={setCityFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Cidades</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={performanceFilter}
            onValueChange={setPerformanceFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Performances</SelectItem>
              <SelectItem value="alta">Alta (≥80%)</SelectItem>
              <SelectItem value="media">Média (60-79%)</SelectItem>
              <SelectItem value="baixa">Baixa (<60%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Tarefas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Em Progresso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStores.map((store) => (
                  <tr key={store.storeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{store.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{store.storeCity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{store.tasksTotal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{store.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{store.tasksInProgress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{store.tasksDelayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${store.performance >= 80 ? 'bg-green-500' : store.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${store.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{store.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/supervisor/loja/${store.storeId}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default StoreListPage;
