import { prisma } from '../../config/prisma';
import { professorCreateSchema, professorUpdateSchema } from './professores.schema';

export async function listProfessores() {
  return prisma.professor.findMany({
    orderBy: {
      nome: 'asc'
    },
    include: {
      turmas: true
    }
  });
}

export async function getProfessorById(id: number) {
  return prisma.professor.findUnique({
    where: { idProfessor: id },
    include: { turmas: true }
  });
}

export async function createProfessor(payload: unknown) {
  const data = professorCreateSchema.parse(payload);

  return prisma.professor.create({
    data: {
      nome: data.nome,
      especialidade: data.especialidade ?? null,
      email: data.email ?? null,
      telefone: data.telefone ?? null
    }
  });
}

export async function updateProfessor(id: number, payload: unknown) {
  const data = professorUpdateSchema.parse(payload);

  return prisma.professor.update({
    where: { idProfessor: id },
    data: {
      ...(data.nome !== undefined ? { nome: data.nome } : {}),
      ...(data.especialidade !== undefined ? { especialidade: data.especialidade } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.telefone !== undefined ? { telefone: data.telefone } : {})
    }
  });
}

export async function deleteProfessor(id: number) {
  return prisma.professor.delete({
    where: { idProfessor: id }
  });
}