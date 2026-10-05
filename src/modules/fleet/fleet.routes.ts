import { Router } from 'express';
import { fleetService } from './fleet.service';
import { authenticate, authorize } from '../auth/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin', 'gestor'), async (req, res) => {
  const token = (req as any).token as string;
  const vehicle = await fleetService.create(token, req.body);
  res.status(201).json(vehicle);
});

router.get('/', authenticate, async (req, res) => {
  const token = (req as any).token as string;
  res.json(await fleetService.list(token));
});

router.put('/:id', authenticate, authorize('admin', 'gestor'), async (req, res) => {
  const token = (req as any).token as string;
  const id = req.params.id as string;
  res.json(await fleetService.update(token, id, req.body));
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const token = (req as any).token as string;
  const id = req.params.id as string;
  await fleetService.remove(token, id);
  res.status(204).send();
});

export default router;