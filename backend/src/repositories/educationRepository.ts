import EducationModel, { IEducation } from '../models/Education';

/**
 * Repository for Education — isolates all Mongoose queries.
 */
export const EducationRepository = {
  findAll: (): Promise<IEducation[]> => EducationModel.find().lean().exec() as Promise<IEducation[]>,
};
