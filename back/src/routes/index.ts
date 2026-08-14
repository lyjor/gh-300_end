import { Router } from 'express';
import { alunosRouter } from '../modules/alunos/alunos.routes';
import { cursosRouter } from '../modules/cursos/cursos.routes';
import { professoresRouter } from '../modules/professores/professores.routes';
import { turmasRouter } from '../modules/turmas/turmas.routes';
import { authRouter } from '../modules/auth/auth.routes';

export const apiRouter = Router();
export { authRouter };

apiRouter.use('/alunos', alunosRouter);
apiRouter.use('/turmas', turmasRouter);
apiRouter.use('/professores', professoresRouter);
apiRouter.use('/cursos', cursosRouter);