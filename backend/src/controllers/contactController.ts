import { Request, Response, NextFunction } from 'express';
import { ContactRepository } from '../repositories/contactRepository';
import { sendContactNotification } from '../services/emailService';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.body is already validated + sanitized by Zod middleware at the route level
    const { name, email, message } = req.body;

    // 1. Persist to MongoDB (primary operation)
    await ContactRepository.create({ name, email, message });

    // 2. Fire email notification (non-blocking — failure here doesn't affect the DB save)
    sendContactNotification({ senderName: name, senderEmail: email, message }).catch((err) => {
      console.error('[ContactController] Email notification failed (non-fatal):', err.message);
    });

    res.status(201).json({ message: 'Contact submitted successfully' });
  } catch (error) {
    next(error);
  }
};
