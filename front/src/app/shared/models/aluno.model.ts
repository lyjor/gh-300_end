export interface Aluno {
  idAluno: number;
  nome: string;
  dataNascimento: string | null;
  email: string | null;
  telefone: string | null;
  idTurma: number | null;
}