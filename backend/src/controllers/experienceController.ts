import { Request, Response, NextFunction } from 'express';
import { ExperienceRepository } from '../repositories/experienceRepository';

export const getExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ExperienceRepository.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
