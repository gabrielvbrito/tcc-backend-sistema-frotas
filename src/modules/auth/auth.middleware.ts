import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/supabase';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Token inválido' });

  (req as any).user = data.user;
  next();
}

export function authorize(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (!profile || !allowedRoles.includes(profile.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}
