import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Centralized Express error handling middleware.
 * All controllers call next(error) instead of writing inline res.status(500) blocks.
 * This is the single place to change error response shape across the entire API.
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  
  // Mask 500 error details in production to prevent information leakage
  const isProduction = process.env.NODE_ENV === 'production';
  const message = (statusCode === 500 && isProduction) 
    ? 'Internal Server Error' 
    : (err.message ?? 'Internal Server Error');

  console.error(`[Error] ${req.method} ${req.path} → ${statusCode}: ${err.message || 'No details'}`);

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      path: req.path,
    },
  });
};
