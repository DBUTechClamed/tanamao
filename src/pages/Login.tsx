
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [role, setRole] = useState<UserRole>('gerente');
  const [userId, setUserId] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!userId) {
      alert('Por favor, selecione um usuário');
      return;
    }

    login(role, userId);

    // Redirecionar para a página apropriada com base no perfil
    switch (role) {
      case 'gerente':
        navigate('/gerente');
        break;
      case 'colaborador':
        navigate('/colaborador');
        break;
      case 'supervisor':
        navigate('/supervisor');
        break;
      case 'matriz_adm':
        navigate('/admin');
        break;
      default:
        navigate('/');
        break;
    }
  };

  // Lista de usuários disponíveis com base no perfil selecionado
  const getUserOptions = () => {
    switch (role) {
      case 'gerente':
        return (
          <>
            <SelectItem value="1">João Silva</SelectItem>
          </>
        );
      case 'colaborador':
        return (
          <>
            <SelectItem value="2">Maria Oliveira (Farmacêutico)</SelectItem>
            <SelectItem value="3">Pedro Santos (Atendente)</SelectItem>
            <SelectItem value="4">Ana Costa (Estoquista)</SelectItem>
          </>
        );
      case 'supervisor':
        return (
          <>
            <SelectItem value="5">Carlos Souza</SelectItem>
          </>
        );
      case 'matriz_adm':
        return (
          <>
            <SelectItem value="6">Fernanda Lima</SelectItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">TáNaMão</CardTitle>
          <CardDescription>Sistema de Gestão de Tarefas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Selecione seu perfil:</label>
            <Select defaultValue="gerente" onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gerente">Gerente de Loja</SelectItem>
                <SelectItem value="colaborador">Colaborador</SelectItem>
                <SelectItem value="supervisor">Supervisor Regional</SelectItem>
                <SelectItem value="matriz_adm">Matriz ADM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Selecione o usuário:</label>
            <Select onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o usuário" />
              </SelectTrigger>
              <SelectContent>
                {getUserOptions()}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>Entrar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
