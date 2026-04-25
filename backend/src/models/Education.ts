import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  duration: string;
  details: string;
}

const EducationSchema: Schema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true },
  details: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
