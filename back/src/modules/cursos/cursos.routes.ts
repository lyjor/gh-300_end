import { Router } from 'express';
import {
  destroyCurso,
  indexCursos,
  showCurso,
  storeCurso,
  updateCursoHandler
} from './cursos.controller';

export const cursosRouter = Router();

cursosRouter.get('/', indexCursos);
cursosRouter.get('/:id', showCurso);
cursosRouter.post('/', storeCurso);
cursosRouter.put('/:id', updateCursoHandler);
cursosRouter.delete('/:id', destroyCurso);