import { z } from 'zod';

export const cursoIdSchema = z.coerce.number().int().positive();

export const cursoCreateSchema = z.object({
  nomeCurso: z.string().min(3).max(100),
  descricao: z.string().max(2000).nullable().optional(),
  cargaHoraria: z.coerce.number().int().positive()
});

export const cursoUpdateSchema = cursoCreateSchema.partial();