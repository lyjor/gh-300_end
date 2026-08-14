import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../middlewares/error-handler';
import {
  createAluno,
  deleteAluno,
  getAlunoById,
  listAlunos,
  updateAluno
} from './alunos.service';
import { alunoIdSchema } from './alunos.schema';

export async function indexAlunos(_request: Request, response: Response, next: NextFunction) {
  try {
    const alunos = await listAlunos();
    return response.json(alunos);
  } catch (error) {
    return next(error);
  }
}

export async function showAluno(request: Request, response: Response, next: NextFunction) {
  try {
    const id = alunoIdSchema.parse(request.params.id);
    const aluno = await getAlunoById(id);

    if (!aluno) {
      throw new HttpError(404, 'Aluno não encontrado.');
    }

    return response.json(aluno);
  } catch (error) {
    return next(error);
  }
}

export async function storeAluno(request: Request, response: Response, next: NextFunction) {
  try {
    const aluno = await createAluno(request.body);
    return response.status(201).json(aluno);
  } catch (error) {
    return next(error);
  }
}

export async function updateAlunoHandler(request: Request, response: Response, next: NextFunction) {
  try {
    const id = alunoIdSchema.parse(request.params.id);
    const aluno = await updateAluno(id, request.body);
    return response.json(aluno);
  } catch (error) {
    return next(error);
  }
}

export async function destroyAluno(request: Request, response: Response, next: NextFunction) {
  try {
    const id = alunoIdSchema.parse(request.params.id);
    await deleteAluno(id);
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}