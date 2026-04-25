import { Request, Response, NextFunction } from 'express';
import { SkillRepository } from '../repositories/skillRepository';

export const getSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await SkillRepository.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
