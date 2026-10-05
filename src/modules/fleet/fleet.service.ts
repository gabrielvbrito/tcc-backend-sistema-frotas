import { clienteDoUsuario } from '../../config/supabase';

export const fleetService = {
  create: async (token: string, vehicle: any) => {
    const { data, error } = await clienteDoUsuario(token)
      .from('vehicles').insert(vehicle).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  list: async (token: string) => {
    const { data, error } = await clienteDoUsuario(token).from('vehicles').select('*');
    if (error) throw new Error(error.message);
    return data;
  },
  update: async (token: string, id: string, updates: any) => {
    const { data, error } = await clienteDoUsuario(token)
      .from('vehicles').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  remove: async (token: string, id: string) => {
    const { error } = await clienteDoUsuario(token).from('vehicles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};