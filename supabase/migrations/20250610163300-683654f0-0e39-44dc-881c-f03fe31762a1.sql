
-- Criar tabela de regiões
CREATE TABLE public.regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de lojas
CREATE TABLE public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de perfis de usuário
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('gerente', 'colaborador', 'supervisor', 'matriz_adm')),
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de tarefas
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  observations TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('urgent_important', 'important', 'urgent', 'normal')),
  frequency TEXT NOT NULL CHECK (frequency IN ('diaria', 'semanal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual', 'pontual', 'quinzenal')),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida', 'atrasada')),
  delegable BOOLEAN DEFAULT true,
  extendable BOOLEAN DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de delegados de tarefas (muitos para muitos)
CREATE TABLE public.task_delegates (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_delegates ENABLE ROW LEVEL SECURITY;

-- Políticas para regiões (visível para supervisores e admins)
CREATE POLICY "Supervisors and admins can view regions" ON public.regions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('supervisor', 'matriz_adm')
    )
  );

CREATE POLICY "Admins can manage regions" ON public.regions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'matriz_adm'
    )
  );

-- Políticas para lojas
CREATE POLICY "Users can view stores in their region or store" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() 
      AND (
        up.store_id = stores.id OR 
        up.region_id = stores.region_id OR
        up.role = 'matriz_adm'
      )
    )
  );

CREATE POLICY "Admins can manage stores" ON public.stores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'matriz_adm'
    )
  );

-- Políticas para perfis de usuário
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Gerentes can view profiles in their store" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles manager
      WHERE manager.id = auth.uid() 
      AND manager.role = 'gerente'
      AND manager.store_id = user_profiles.store_id
    )
  );

CREATE POLICY "Supervisors can view profiles in their region" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles supervisor
      WHERE supervisor.id = auth.uid() 
      AND supervisor.role = 'supervisor'
      AND supervisor.region_id = user_profiles.region_id
    )
  );

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'matriz_adm'
    )
  );

-- Políticas para tarefas
CREATE POLICY "Users can view tasks in their store" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() 
      AND (
        up.store_id = tasks.store_id OR
        up.role IN ('supervisor', 'matriz_adm')
      )
    )
  );

CREATE POLICY "Gerentes can manage tasks in their store" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'gerente'
      AND up.store_id = tasks.store_id
    )
  );

CREATE POLICY "Admins can manage all tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND role = 'matriz_adm'
    )
  );

-- Políticas para delegados de tarefas
CREATE POLICY "Users can view task delegates for accessible tasks" ON public.task_delegates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.user_profiles up ON up.id = auth.uid()
      WHERE t.id = task_delegates.task_id
      AND (
        up.store_id = t.store_id OR
        up.role IN ('supervisor', 'matriz_adm')
      )
    )
  );

CREATE POLICY "Gerentes can manage task delegates in their store" ON public.task_delegates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.user_profiles up ON up.id = auth.uid()
      WHERE t.id = task_delegates.task_id
      AND up.role = 'gerente'
      AND up.store_id = t.store_id
    )
  );

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'colaborador'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir dados iniciais
INSERT INTO public.regions (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Grande São Paulo');

INSERT INTO public.stores (id, name, city, state, region_id) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Farmácia Central', 'São Paulo', 'SP', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', 'Farmácia Norte', 'Guarulhos', 'SP', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440004', 'Farmácia Sul', 'São Bernardo', 'SP', '550e8400-e29b-41d4-a716-446655440001');
