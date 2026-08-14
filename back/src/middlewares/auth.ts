import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedUser {
  sub: string;
  email?: string;
  role?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export function authenticateRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token ausente ou inválido.' });
  }

  try {
    const token = authorization.slice(7);
    request.user = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    return next();
  } catch {
    return response.status(401).json({ message: 'Token ausente ou inválido.' });
  }
}