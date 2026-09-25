import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import fleetRoutes from './modules/fleet/fleet.routes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vehicles', fleetRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
