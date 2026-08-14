import { z } from 'zod';

export const turmaIdSchema = z.coerce.number().int().positive();

export const turmaCreateSchema = z.object({
  nomeTurma: z.string().min(2).max(50),
  ano: z.coerce.number().int().positive(),
  idCurso: z.coerce.number().int().positive().nullable().optional(),
  idProfessor: z.coerce.number().int().positive().nullable().optional()
});

export const turmaUpdateSchema = turmaCreateSchema.partial();