import mongoose from 'mongoose';
import { config } from './config/env';
import { seedDatabase } from './seed';

mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB for Manual Seeding');
    await seedDatabase();
    console.log('🏁 Seeding process complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
