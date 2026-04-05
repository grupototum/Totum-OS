import { Request, Response, NextFunction } from 'express';

export interface HttpError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  console.error(`[ERROR] ${statusCode} - ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
};