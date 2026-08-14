import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function errorHandler(
  err: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Error) {
    return response.status(500).json({ message: err.message });
  }

  return response.status(500).json({ message: 'Erro interno inesperado.' });
}