import { Router } from 'express';
import { getExperiences } from '../controllers/experienceController';

const router = Router();

router.get('/', getExperiences);

export default router;
