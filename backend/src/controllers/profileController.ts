import { Request, Response, NextFunction } from 'express';
import { ProfileRepository } from '../repositories/profileRepository';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ProfileRepository.findOne();
    if (!data) {
      const err: AppError = new Error('Profile not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};
