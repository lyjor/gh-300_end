import { prisma } from '../../config/prisma';
import { alunoCreateSchema, alunoUpdateSchema } from './alunos.schema';

export async function listAlunos() {
  return prisma.aluno.findMany({
    orderBy: {
      nome: 'asc'
    },
    include: {
      turma: true
    }
  });
}

export async function getAlunoById(id: number) {
  return prisma.aluno.findUnique({
    where: { idAluno: id },
    include: { turma: true }
  });
}

export async function createAluno(payload: unknown) {
  const data = alunoCreateSchema.parse(payload);

  return prisma.aluno.create({
    data: {
      nome: data.nome,
      dataNascimento: data.dataNascimento ?? null,
      email: data.email ?? null,
      telefone: data.telefone ?? null,
      idTurma: data.idTurma ?? null
    }
  });
}

export async function updateAluno(id: number, payload: unknown) {
  const data = alunoUpdateSchema.parse(payload);

  return prisma.aluno.update({
    where: { idAluno: id },
    data: {
      ...(data.nome !== undefined ? { nome: data.nome } : {}),
      ...(data.dataNascimento !== undefined ? { dataNascimento: data.dataNascimento } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.telefone !== undefined ? { telefone: data.telefone } : {}),
      ...(data.idTurma !== undefined ? { idTurma: data.idTurma } : {})
    }
  });
}

export async function deleteAluno(id: number) {
  return prisma.aluno.delete({
    where: { idAluno: id }
  });
}