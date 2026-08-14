import { Router } from 'express';
import {
  destroyTurma,
  indexTurmas,
  showTurma,
  storeTurma,
  updateTurmaHandler
} from './turmas.controller';

export const turmasRouter = Router();

turmasRouter.get('/', indexTurmas);
turmasRouter.get('/:id', showTurma);
turmasRouter.post('/', storeTurma);
turmasRouter.put('/:id', updateTurmaHandler);
turmasRouter.delete('/:id', destroyTurma);