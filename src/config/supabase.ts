import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL ?? '';
const anonKey = process.env.SUPABASE_ANON_KEY ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!url || !anonKey || !serviceKey) {
  throw new Error(
    'Faltam variaveis no .env: SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY'
  );
}

// Nenhum cliente guarda sessao: cada requisicao e independente.
const semSessao = { auth: { persistSession: false, autoRefreshToken: false } };

// 1) Somente para login e validacao de token. Um cliente novo a cada uso.
export function clienteAuth() {
  return createClient(url, anonKey, semSessao);
}

// 2) Cliente de dados: um novo por requisicao, com o token de quem esta pedindo.
//    Assim o RLS do banco sabe quem e o usuario (auth.uid()).
export function clienteDoUsuario(token: string) {
  return createClient(url, anonKey, {
    ...semSessao,
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// 3) Service role: ignora o RLS. Reservado para rotinas internas
//    (ex.: consumidor Kafka). NAO usar dentro de rotas da API.
export const supabaseAdmin = createClient(url, serviceKey, semSessao);