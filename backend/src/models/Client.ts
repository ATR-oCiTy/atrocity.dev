import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  logoUrl: string;
  domain: string;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  domain: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
