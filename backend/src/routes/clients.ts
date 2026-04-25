import { Router } from 'express';
import { getClients } from '../controllers/clientsController';

const router = Router();

router.get('/', getClients);

export default router;
