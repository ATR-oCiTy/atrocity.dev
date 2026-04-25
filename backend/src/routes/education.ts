import { Router } from 'express';
import { getEducation } from '../controllers/educationController';

const router = Router();

router.get('/', getEducation);

export default router;
