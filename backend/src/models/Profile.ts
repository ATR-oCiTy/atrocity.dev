import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  alias: string;
  tagline: string;
  bioLines: string[];
  location: string;
  email: string;
  linkedinUrl: string;
}

const ProfileSchema: Schema = new Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true },
  tagline: { type: String, required: true },
  bioLines: { type: [String], required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
