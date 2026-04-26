import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import experienceRoutes from './routes/experience';
import educationRoutes from './routes/education';
import profileRoutes from './routes/profile';
import skillsRoutes from './routes/skills';
import contactRoutes from './routes/contact';
import clientsRoutes from './routes/clients';
import { seedDatabase } from './seed';

const app = express();

// Trust the Nginx reverse proxy so rate limiting uses the real client IP, not the Nginx container IP
app.set('trust proxy', 1);

// Middleware
// Restrict CORS to the actual frontend domain and localhost for dev
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? ['https://atrocity.dev', 'https://www.atrocity.dev'] 
    : [/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Easter egg: custom header visible in DevTools Network tab / curl / Burp
app.use((_req, res, next) => {
  res.setHeader('X-Easter-Egg', 'You found a hidden header. Try typing "help" in the terminal on the site.');
  res.setHeader('X-Powered-By', 'caffeine-and-curiosity');
  next();
});

// Routes
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/clients', clientsRoutes);

// Centralized error handler — must be last middleware registered
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    await seedDatabase();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
});
