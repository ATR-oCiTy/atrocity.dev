import ExperienceModel, { IExperience } from '../models/Experience';

/**
 * Repository for Experience — isolates all Mongoose queries.
 * Swap the ORM here without touching controllers.
 */
export const ExperienceRepository = {
  findAll: (): Promise<IExperience[]> => ExperienceModel.find().lean().exec() as Promise<IExperience[]>,
};
