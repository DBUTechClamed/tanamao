
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreStats } from '../types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data para lojas supervisionadas
const mockStoreStats: StoreStats[] = [
  {
    storeId: '001',
    storeName: 'Filial 001 - Centro',
    storeCity: 'Curitiba',
    tasksTotal: 15,
    tasksCompleted: 12,
    tasksInProgress: 2,
    tasksPending: 1,
    tasksDelayed: 0,
    performance: 85
  },
  {
    storeId: '002', 
    storeName: 'Filial 002 - Batel',
    storeCity: 'Curitiba',
    tasksTotal: 12,
    tasksCompleted: 10,
    tasksInProgress: 1,
    tasksPending: 1,
    tasksDelayed: 0,
    performance: 92
  },
  {
    storeId: '003',
    storeName: 'Filial 003 - Água Verde',
    storeCity: 'Curitiba',
    tasksTotal: 18,
    tasksCompleted: 14,
    tasksInProgress: 2,
    tasksPending: 1,
    tasksDelayed: 1,
    performance: 78
  },
  {
    storeId: '004',
    storeName: 'Filial 004 - Centro',
    storeCity: 'Londrina',
    tasksTotal: 20,
    tasksCompleted: 16,
    tasksInProgress: 3,
    tasksPending: 0,
    tasksDelayed: 1,
    performance: 82
  },
  {
    storeId: '005',
    storeName: 'Filial 005 - Zona Norte',
    storeCity: 'Londrina',
    tasksTotal: 14,
    tasksCompleted: 11,
    tasksInProgress: 2,
    tasksPending: 1,
    tasksDelayed: 0,
    performance: 88
  },
  {
    storeId: '006',
    storeName: 'Filial 006 - Shopping',
    storeCity: 'Maringá',
    tasksTotal: 16,
    tasksCompleted: 12,
    tasksInProgress: 2,
    tasksPending: 1,
    tasksDelayed: 1,
    performance: 75
  }
];

const StoreListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('todas');
  const [performanceFilter, setPerformanceFilter] = useState<string>('todas');

  // Extract unique cities for filter
  const cities = Array.from(new Set(mockStoreStats.map(store => store.storeCity)));

  // Filter stores based on search term and filters
  const filteredStores = mockStoreStats.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (store.storeCity && store.storeCity.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = cityFilter === 'todas' || store.storeCity === cityFilter;
    
    const matchesPerformance = performanceFilter === 'todas' ||
                              (performanceFilter === 'alta' && store.performance >= 80) ||
                              (performanceFilter === 'media' && store.performance >= 60 && store.performance < 80) ||
                              (performanceFilter === 'baixa' && store.performance < 60);
    
    return matchesSearch && matchesCity && matchesPerformance;
  });

  const handleViewDetails = (storeId: string) => {
    navigate(`/supervisor/loja/${storeId}`);
  };

  return (
    <Layout title="Lojas Supervisionadas">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar loja..."
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
                <SelectItem key={city} value={city || ''}>{city}</SelectItem>
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
              <SelectItem value="baixa">Baixa (&lt;60%)</SelectItem>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tarefas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídas</th>
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
                        onClick={() => handleViewDetails(store.storeId)}
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
