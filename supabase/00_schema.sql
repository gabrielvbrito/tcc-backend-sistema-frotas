-- FleetSync: esquema inicial do banco (Supabase / PostgreSQL)

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'gestor', 'user')),
  created_at timestamp with time zone default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  plate text not null unique,
  model text not null,
  brand text,
  year int,
  status text default 'ativo' check (status in ('ativo', 'manutencao', 'inativo')),
  owner_id uuid references profiles(id),
  created_at timestamp with time zone default now()
);