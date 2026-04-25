import { Request, Response, NextFunction } from 'express';
import { ClientRepository } from '../repositories/clientRepository';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ClientRepository.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
