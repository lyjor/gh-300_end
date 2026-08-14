import { NextFunction, Request, Response } from 'express';
import { login } from './auth.service';

export async function loginHandler(request: Request, response: Response, next: NextFunction) {
  try {
    const result = await login(request.body);
    return response.json(result);
  } catch (error) {
    return next(error);
  }
}