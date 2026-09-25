import { supabase } from '../../config/supabase';

export const fleetService = {
  create: async (vehicle: any) => {
    const { data, error } = await supabase.from('vehicles').insert(vehicle).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  list: async () => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw new Error(error.message);
    return data;
  },
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};
