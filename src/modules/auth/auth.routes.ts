import { Router } from 'express';
import { loginUser, getProfile } from './auth.service';
import { authenticate } from './auth.middleware';
import { registrarAuditoria } from '../audit/audit.service';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await loginUser(email, password);
    await registrarAuditoria({
      usuarioId: data.user?.id,
      acao: 'LOGIN_SUCESSO',
      entidade: 'auth',
      registroId: data.user?.id,
      detalhes: { ip: req.ip },
    });
    res.json(data);
  } catch (err: any) {
    await registrarAuditoria({
      acao: 'LOGIN_FALHA',
      entidade: 'auth',
      detalhes: { email, ip: req.ip },
    });
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const { user, token } = req as any;
  const profile = await getProfile(user.id, token);
  res.json(profile);
});

export default router;