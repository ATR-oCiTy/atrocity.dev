import ProfileModel, { IProfile } from '../models/Profile';

/**
 * Repository for Profile — isolates all Mongoose queries.
 */
export const ProfileRepository = {
  findOne: (): Promise<IProfile | null> => ProfileModel.findOne().lean().exec() as Promise<IProfile | null>,
};
