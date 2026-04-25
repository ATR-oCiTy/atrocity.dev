import { Router } from 'express';
import { getSkills } from '../controllers/skillsController';

const router = Router();

router.get('/', getSkills);

export default router;
