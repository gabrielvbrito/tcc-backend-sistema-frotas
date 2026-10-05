-- FleetSync: trilha de auditoria imutavel (RNF10)

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  usuario_id uuid,
  acao text not null,
  entidade text not null,
  registro_id text,
  dados_antes jsonb,
  dados_depois jsonb,
  origem text not null default 'banco'
);

alter table public.audit_log enable row level security;

drop policy if exists "Admin e gestor leem auditoria" on public.audit_log;
create policy "Admin e gestor leem auditoria"
on public.audit_log for select to authenticated
using (public.current_user_role() in ('admin', 'gestor'));

-- Permissoes: ninguem edita ou apaga; so o backend interno insere
revoke all on public.audit_log from anon, authenticated, service_role;
grant select on public.audit_log to authenticated, service_role;
grant insert on public.audit_log to service_role;

-- Bloqueio de alteracao, exclusao e truncate (vale ate para o dono da tabela)
create or replace function public.audit_log_imutavel()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log e imutavel: operacao % nao permitida', tg_op;
end
$$;

drop trigger if exists audit_log_sem_alteracao on public.audit_log;
create trigger audit_log_sem_alteracao
before update or delete on public.audit_log
for each row execute function public.audit_log_imutavel();

drop trigger if exists audit_log_sem_truncate on public.audit_log;
create trigger audit_log_sem_truncate
before truncate on public.audit_log
for each statement execute function public.audit_log_imutavel();

-- Registro automatico das mudancas
create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_antes jsonb;
  v_depois jsonb;
begin
  if tg_op in ('UPDATE', 'DELETE') then v_antes := to_jsonb(old); end if;
  if tg_op in ('INSERT', 'UPDATE') then v_depois := to_jsonb(new); end if;

  insert into public.audit_log
    (usuario_id, acao, entidade, registro_id, dados_antes, dados_depois, origem)
  values
    (auth.uid(), tg_op, tg_table_name,
     coalesce(v_depois ->> 'id', v_antes ->> 'id'),
     v_antes, v_depois, 'banco');

  return null;
end
$$;

drop trigger if exists vehicles_auditoria on public.vehicles;
create trigger vehicles_auditoria
after insert or update or delete on public.vehicles
for each row execute function public.registrar_auditoria();

drop trigger if exists profiles_auditoria on public.profiles;
create trigger profiles_auditoria
after insert or update or delete on public.profiles
for each row execute function public.registrar_auditoria();