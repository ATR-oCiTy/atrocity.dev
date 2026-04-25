import ContactModel from '../models/Contact';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * Repository for Contact — isolates all Mongoose queries.
 */
export const ContactRepository = {
  create: (payload: ContactPayload) => ContactModel.create(payload),
};
