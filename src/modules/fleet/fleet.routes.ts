import { Router } from 'express';
import { fleetService } from './fleet.service';
import { authenticate, authorize } from '../auth/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin', 'gestor'), async (req, res) => {
  const vehicle = await fleetService.create(req.body);
  res.status(201).json(vehicle);
});

router.get('/', authenticate, async (req, res) => {
  res.json(await fleetService.list());
});

router.put('/:id', authenticate, authorize('admin', 'gestor'), async (req, res) => {
  const id = req.params.id as string;
  res.json(await fleetService.update(id, req.body));
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const id = req.params.id as string;
  await fleetService.remove(id);
  res.status(204).send();
});

export default router;
