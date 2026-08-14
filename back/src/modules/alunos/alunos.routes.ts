import { Router } from 'express';
import {
  destroyAluno,
  indexAlunos,
  showAluno,
  storeAluno,
  updateAlunoHandler
} from './alunos.controller';

export const alunosRouter = Router();

alunosRouter.get('/', indexAlunos);
alunosRouter.get('/:id', showAluno);
alunosRouter.post('/', storeAluno);
alunosRouter.put('/:id', updateAlunoHandler);
alunosRouter.delete('/:id', destroyAluno);