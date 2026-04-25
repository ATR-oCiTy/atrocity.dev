import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { validate } from '../middleware/validate';
import { contactSchema } from '../middleware/validation/contactSchema';

const router = Router();

router.post('/', validate(contactSchema), submitContact);

export default router;
