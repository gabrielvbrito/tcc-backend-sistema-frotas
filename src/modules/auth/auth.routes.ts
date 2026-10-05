import { Router } from 'express';
import { loginUser, getProfile } from './auth.service';
import { authenticate } from './auth.middleware';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const { user, token } = req as any;
  const profile = await getProfile(user.id, token);
  res.json(profile);
});

export default router;