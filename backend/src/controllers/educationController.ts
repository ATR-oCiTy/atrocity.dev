import { Request, Response, NextFunction } from 'express';
import { EducationRepository } from '../repositories/educationRepository';

export const getEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await EducationRepository.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
