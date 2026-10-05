-- FleetSync: Row Level Security (RNF04)

alter table profiles enable row level security;
alter table vehicles enable row level security;

-- Descobre o papel de quem esta pedindo. SECURITY DEFINER evita a recursao
-- infinita que acontecia ao consultar profiles dentro de uma politica de profiles.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- profiles
drop policy if exists "Usuario ve o proprio perfil" on profiles;
drop policy if exists "Admin ve todos os perfis" on profiles;

create policy "Usuario ve o proprio perfil"
on profiles for select
using (auth.uid() = id);

create policy "Admin ve todos os perfis"
on profiles for select to authenticated
using (public.current_user_role() = 'admin');

-- vehicles
drop policy if exists "Autenticados veem veiculos" on vehicles;
drop policy if exists "Admin e gestor criam veiculos" on vehicles;
drop policy if exists "Admin e gestor atualizam veiculos" on vehicles;
drop policy if exists "Admin apaga veiculos" on vehicles;

create policy "Autenticados veem veiculos"
on vehicles for select to authenticated
using (true);

create policy "Admin e gestor criam veiculos"
on vehicles for insert to authenticated
with check (public.current_user_role() in ('admin', 'gestor'));

create policy "Admin e gestor atualizam veiculos"
on vehicles for update to authenticated
using (public.current_user_role() in ('admin', 'gestor'))
with check (public.current_user_role() in ('admin', 'gestor'));

create policy "Admin apaga veiculos"
on vehicles for delete to authenticated
using (public.current_user_role() = 'admin');