import { z } from 'zod';

export const alunoIdSchema = z.coerce.number().int().positive();

export const alunoCreateSchema = z.object({
  nome: z.string().min(3).max(100),
  dataNascimento: z.coerce.date().nullable().optional(),
  email: z.string().email().max(100).nullable().optional(),
  telefone: z.string().min(8).max(20).nullable().optional(),
  idTurma: z.coerce.number().int().positive().nullable().optional()
});

export const alunoUpdateSchema = alunoCreateSchema.partial();