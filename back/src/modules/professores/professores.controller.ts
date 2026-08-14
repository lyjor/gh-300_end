import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../middlewares/error-handler';
import {
  createProfessor,
  deleteProfessor,
  getProfessorById,
  listProfessores,
  updateProfessor
} from './professores.service';
import { professorIdSchema } from './professores.schema';

export async function indexProfessores(_request: Request, response: Response, next: NextFunction) {
  try {
    const professores = await listProfessores();
    return response.json(professores);
  } catch (error) {
    return next(error);
  }
}

export async function showProfessor(request: Request, response: Response, next: NextFunction) {
  try {
    const id = professorIdSchema.parse(request.params.id);
    const professor = await getProfessorById(id);

    if (!professor) {
      throw new HttpError(404, 'Professor não encontrado.');
    }

    return response.json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function storeProfessor(request: Request, response: Response, next: NextFunction) {
  try {
    const professor = await createProfessor(request.body);
    return response.status(201).json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfessorHandler(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = professorIdSchema.parse(request.params.id);
    const professor = await updateProfessor(id, request.body);
    return response.json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function destroyProfessor(request: Request, response: Response, next: NextFunction) {
  try {
    const id = professorIdSchema.parse(request.params.id);
    await deleteProfessor(id);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}