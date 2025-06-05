
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';

// Mock de lojas para o supervisor
const mockStores = [
  { id: '1', name: 'Farmácia Centro', location: 'Centro - Curitiba/PR', performance: 85 },
  { id: '2', name: 'Farmácia Shopping', location: 'Shopping - Curitiba/PR', performance: 72 },
  { id: '3', name: 'Farmácia Norte', location: 'Bairro Norte - Curitiba/PR', performance: 68 },
  { id: '4', name: 'Farmácia Sul', location: 'Bairro Sul - Curitiba/PR', performance: 91 },
];

const StoreListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Lojas da Região">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockStores.map((store) => (
          <Card key={store.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{store.name}</CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{store.location}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Performance: <span className="font-semibold">{store.performance}%</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/supervisor/loja/${store.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="sm"
                    style={{ backgroundColor: '#118f55' }}
                    onClick={() => navigate(`/supervisor/lojas/${store.id}/atribuir-tarefa`)}
                  >
                    Atribuir Tarefa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default StoreListPage;
