import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { validate } from '../middleware/validate';
import { contactSchema } from '../middleware/validation/contactSchema';

import rateLimit from 'express-rate-limit';

const router = Router();

// Limit contact form submissions to 5 per IP per hour to prevent spam/DoS
const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: { message: 'Too many contact requests from this IP, please try again after an hour' } },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactRateLimiter, validate(contactSchema), submitContact);

export default router;
