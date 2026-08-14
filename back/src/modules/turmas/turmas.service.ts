import { prisma } from '../../config/prisma';
import { turmaCreateSchema, turmaUpdateSchema } from './turmas.schema';

export async function listTurmas() {
  return prisma.turma.findMany({
    orderBy: {
      ano: 'desc'
    },
    include: {
      curso: true,
      professor: true,
      alunos: true
    }
  });
}

export async function getTurmaById(id: number) {
  return prisma.turma.findUnique({
    where: { idTurma: id },
    include: {
      curso: true,
      professor: true,
      alunos: true
    }
  });
}

export async function createTurma(payload: unknown) {
  const data = turmaCreateSchema.parse(payload);

  return prisma.turma.create({
    data: {
      nomeTurma: data.nomeTurma,
      ano: data.ano,
      idCurso: data.idCurso ?? null,
      idProfessor: data.idProfessor ?? null
    }
  });
}

export async function updateTurma(id: number, payload: unknown) {
  const data = turmaUpdateSchema.parse(payload);

  return prisma.turma.update({
    where: { idTurma: id },
    data: {
      ...(data.nomeTurma !== undefined ? { nomeTurma: data.nomeTurma } : {}),
      ...(data.ano !== undefined ? { ano: data.ano } : {}),
      ...(data.idCurso !== undefined ? { idCurso: data.idCurso } : {}),
      ...(data.idProfessor !== undefined ? { idProfessor: data.idProfessor } : {})
    }
  });
}

export async function deleteTurma(id: number) {
  return prisma.turma.delete({
    where: { idTurma: id }
  });
}