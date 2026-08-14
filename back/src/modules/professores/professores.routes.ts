import { Router } from 'express';
import {
  destroyProfessor,
  indexProfessores,
  showProfessor,
  storeProfessor,
  updateProfessorHandler
} from './professores.controller';

export const professoresRouter = Router();

professoresRouter.get('/', indexProfessores);
professoresRouter.get('/:id', showProfessor);
professoresRouter.post('/', storeProfessor);
professoresRouter.put('/:id', updateProfessorHandler);
professoresRouter.delete('/:id', destroyProfessor);