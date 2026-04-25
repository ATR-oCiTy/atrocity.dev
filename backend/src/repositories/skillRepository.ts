import SkillModel, { ISkill } from '../models/Skill';

/**
 * Repository for Skills — isolates all Mongoose queries.
 */
export const SkillRepository = {
  findAll: (): Promise<ISkill[]> => SkillModel.find().lean().exec() as Promise<ISkill[]>,
};
