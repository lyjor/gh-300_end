import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../middlewares/error-handler';
import {
  createCurso,
  deleteCurso,
  getCursoById,
  listCursos,
  updateCurso
} from './cursos.service';
import { cursoIdSchema } from './cursos.schema';

export async function indexCursos(_request: Request, response: Response, next: NextFunction) {
  try {
    const cursos = await listCursos();
    return response.json(cursos);
  } catch (error) {
    return next(error);
  }
}

export async function showCurso(request: Request, response: Response, next: NextFunction) {
  try {
    const id = cursoIdSchema.parse(request.params.id);
    const curso = await getCursoById(id);

    if (!curso) {
      throw new HttpError(404, 'Curso não encontrado.');
    }

    return response.json(curso);
  } catch (error) {
    return next(error);
  }
}

export async function storeCurso(request: Request, response: Response, next: NextFunction) {
  try {
    const curso = await createCurso(request.body);
    return response.status(201).json(curso);
  } catch (error) {
    return next(error);
  }
}

export async function updateCursoHandler(request: Request, response: Response, next: NextFunction) {
  try {
    const id = cursoIdSchema.parse(request.params.id);
    const curso = await updateCurso(id, request.body);
    return response.json(curso);
  } catch (error) {
    return next(error);
  }
}

export async function destroyCurso(request: Request, response: Response, next: NextFunction) {
  try {
    const id = cursoIdSchema.parse(request.params.id);
    await deleteCurso(id);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}