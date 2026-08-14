import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../middlewares/error-handler';
import { turmaIdSchema } from './turmas.schema';
import { createTurma, deleteTurma, getTurmaById, listTurmas, updateTurma } from './turmas.service';

export async function indexTurmas(_request: Request, response: Response, next: NextFunction) {
  try {
    const turmas = await listTurmas();
    return response.json(turmas);
  } catch (error) {
    return next(error);
  }
}

export async function showTurma(request: Request, response: Response, next: NextFunction) {
  try {
    const id = turmaIdSchema.parse(request.params.id);
    const turma = await getTurmaById(id);

    if (!turma) {
      throw new HttpError(404, 'Turma não encontrada.');
    }

    return response.json(turma);
  } catch (error) {
    return next(error);
  }
}

export async function storeTurma(request: Request, response: Response, next: NextFunction) {
  try {
    const turma = await createTurma(request.body);
    return response.status(201).json(turma);
  } catch (error) {
    return next(error);
  }
}

export async function updateTurmaHandler(request: Request, response: Response, next: NextFunction) {
  try {
    const id = turmaIdSchema.parse(request.params.id);
    const turma = await updateTurma(id, request.body);
    return response.json(turma);
  } catch (error) {
    return next(error);
  }
}

export async function destroyTurma(request: Request, response: Response, next: NextFunction) {
  try {
    const id = turmaIdSchema.parse(request.params.id);
    await deleteTurma(id);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}