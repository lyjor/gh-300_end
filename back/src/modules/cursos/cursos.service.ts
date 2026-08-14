import { prisma } from '../../config/prisma';
import { cursoCreateSchema, cursoUpdateSchema } from './cursos.schema';

export async function listCursos() {
  return prisma.curso.findMany({
    orderBy: {
      nomeCurso: 'asc'
    },
    include: {
      turmas: true
    }
  });
}

export async function getCursoById(id: number) {
  return prisma.curso.findUnique({
    where: { idCurso: id },
    include: { turmas: true }
  });
}

export async function createCurso(payload: unknown) {
  const data = cursoCreateSchema.parse(payload);

  return prisma.curso.create({
    data: {
      nomeCurso: data.nomeCurso,
      descricao: data.descricao ?? null,
      cargaHoraria: data.cargaHoraria
    }
  });
}

export async function updateCurso(id: number, payload: unknown) {
  const data = cursoUpdateSchema.parse(payload);

  return prisma.curso.update({
    where: { idCurso: id },
    data: {
      ...(data.nomeCurso !== undefined ? { nomeCurso: data.nomeCurso } : {}),
      ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
      ...(data.cargaHoraria !== undefined ? { cargaHoraria: data.cargaHoraria } : {})
    }
  });
}

export async function deleteCurso(id: number) {
  return prisma.curso.delete({
    where: { idCurso: id }
  });
}