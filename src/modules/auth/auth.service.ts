import { clienteAuth, clienteDoUsuario } from '../../config/supabase';

export async function loginUser(email: string, password: string) {
  const { data, error } = await clienteAuth().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProfile(userId: string, token: string) {
  const { data, error } = await clienteDoUsuario(token)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}