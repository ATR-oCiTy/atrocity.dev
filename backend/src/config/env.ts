/**
 * Centralized environment configuration module.
 * Reads all env vars at startup and fails fast with a clear error if required ones are missing.
 */

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return val;
};

const optional = (key: string, fallback: string): string =>
  process.env[key] ?? fallback;

export const config = {
  port: optional('PORT', '5000'),
  mongoUri: optional('MONGO_URI', 'mongodb://localhost:27017/portfolio'),
  nodeEnv: optional('NODE_ENV', 'development'),
  seedForce: process.env.SEED_FORCE === 'true',
  // Gmail SMTP — set these in .env to enable contact form email notifications
  gmailUser: process.env.GMAIL_USER ?? '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD ?? '',
} as const;
