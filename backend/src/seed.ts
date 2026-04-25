import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Experience from './models/Experience';
import Education from './models/Education';
import Profile from './models/Profile';
import Skill from './models/Skill';
import Client from './models/Client';

/**
 * Seeds the database only if it is empty, preventing duplication on server restarts.
 * To force a full reseed (e.g. after a schema change), set the SEED_FORCE=true env variable:
 *   SEED_FORCE=true npm run dev
 */
export const seedDatabase = async () => {
  try {
    const forceReseed = process.env.SEED_FORCE === 'true';

    if (!forceReseed) {
      // Guard: only seed if all critical collections are empty
      const [profileCount, skillCount, expCount, eduCount, clientCount] = await Promise.all([
        Profile.countDocuments(),
        Skill.countDocuments(),
        Experience.countDocuments(),
        Education.countDocuments(),
        Client.countDocuments(),
      ]);

      if (profileCount > 0 || skillCount > 0 || expCount > 0 || eduCount > 0 || clientCount > 0) {
        console.log('ℹ️  Database already contains data. Skipping seed. Use SEED_FORCE=true to override.');
        return;
      }
    }

    // Load data from JSON so it isn't hardcoded in git
    let seedData;
    const realDataPath = path.join(__dirname, 'data', 'seed-data.json');
    const exampleDataPath = path.join(__dirname, 'data', 'seed-data.example.json');

    if (fs.existsSync(realDataPath)) {
      seedData = JSON.parse(fs.readFileSync(realDataPath, 'utf-8'));
    } else {
      console.warn('⚠️  Real seed data not found, falling back to example data.');
      seedData = JSON.parse(fs.readFileSync(exampleDataPath, 'utf-8'));
    }

    const { profile: seedProfile, skills: seedSkills, experience: seedExperience, education: seedEducation, clients: seedClients } = seedData;

    // Wipe existing collections cleanly before inserting
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Client.deleteMany({});
    console.log('🧹 Cleared old database collections.');

    console.log('🌱 Seeding database with configuration...');
    await Profile.create(seedProfile);
    await Skill.insertMany(seedSkills);
    await Experience.insertMany(seedExperience);
    await Education.insertMany(seedEducation);
    await Client.insertMany(seedClients);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
