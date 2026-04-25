import ClientModel, { IClient } from '../models/Client';

export const ClientRepository = {
  findAll: (): Promise<IClient[]> => ClientModel.find().lean().exec() as Promise<IClient[]>,
};
