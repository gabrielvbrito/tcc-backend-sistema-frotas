import { Request, Response, NextFunction } from 'express';
import { clienteAuth, clienteDoUsuario } from '../../config/supabase';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const { data, error } = await clienteAuth().auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Token inválido' });

  (req as any).user = data.user;
  (req as any).token = token;
  next();
}

export function authorize(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = req as any;
    const { data: profile } = await clienteDoUsuario(token)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profile || !allowedRoles.includes(profile.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}