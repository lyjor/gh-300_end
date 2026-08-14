export interface Turma {
  idTurma: number;
  nomeTurma: string;
  ano: number;
  idCurso: number | null;
  idProfessor: number | null;
}