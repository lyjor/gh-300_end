import { z } from 'zod';

export const professorIdSchema = z.coerce.number().int().positive();

export const professorCreateSchema = z.object({
  nome: z.string().min(3).max(100),
  especialidade: z.string().max(100).nullable().optional(),
  email: z.string().email().max(100).nullable().optional(),
  telefone: z.string().min(8).max(20).nullable().optional()
});

export const professorUpdateSchema = professorCreateSchema.partial();