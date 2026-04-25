import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  skills: string[];
}

const SkillSchema: Schema = new Schema({
  title: { type: String, required: true },
  skills: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
