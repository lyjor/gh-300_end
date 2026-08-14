📘 Sistema de Administração Escolar
🎯 Contexto

Este documento define o padrão de construção de um sistema de administração escolar com arquitetura baseada em Node.js (backend), Angular (frontend) e MySQL (banco de dados).
O objetivo é permitir o gerenciamento eficiente de Alunos, Turmas, Professores e Cursos, garantindo correlações adequadas entre as entidades.
🏗️ Arquitetura

    Backend Node.js

        API RESTful para comunicação com o frontend.

        Autenticação e autorização (JWT).

        CRUD completo para todas as entidades.

        Middleware para validação e segurança.

    Frontend Angular

        Interface responsiva e modular.

        Componentes para cada entidade (Alunos, Turmas, Professores, Cursos).

        Consumo da API via serviços Angular.

        Rotas protegidas por autenticação.

    Banco de Dados MySQL

        Modelo relacional com chaves primárias e estrangeiras.

        Normalização para evitar redundância.

        Scripts de migração e versionamento.

📊 Modelo de Dados
Alunos

    id_aluno (PK)

    nome

    data_nascimento

    email

    telefone

    id_turma (FK → Turmas)

Turmas

    id_turma (PK)

    nome_turma

    ano

    id_curso (FK → Cursos)

    id_professor (FK → Professores)

Professores

    id_professor (PK)

    nome

    especialidade

    email

    telefone

Cursos

    id_curso (PK)

    nome_curso

    descricao

    carga_horaria

🔗 Relações Entre Entidades
Entidade	Relação	Descrição
Alunos	Turmas	Cada aluno pertence a uma turma.
Turmas	Cursos	Cada turma está vinculada a um curso.
Turmas	Professores	Cada turma possui um professor responsável.
Cursos	Turmas	Um curso pode ter várias turmas.
⚙️ Endpoints da API (Node.js)
Alunos

    GET /api/alunos → Lista todos os alunos

    GET /api/alunos/:id → Detalhes de um aluno

    POST /api/alunos → Cria novo aluno

    PUT /api/alunos/:id → Atualiza aluno

    DELETE /api/alunos/:id → Remove aluno

Turmas

    GET /api/turmas

    GET /api/turmas/:id

    POST /api/turmas

    PUT /api/turmas/:id

    DELETE /api/turmas/:id

Professores

    GET /api/professores

    GET /api/professores/:id

    POST /api/professores

    PUT /api/professores/:id

    DELETE /api/professores/:id

Cursos

    GET /api/cursos

    GET /api/cursos/:id

    POST /api/cursos

    PUT /api/cursos/:id

    DELETE /api/cursos/:id

🖥️ Componentes Angular
Estrutura de Módulos

    alunos/ → Componente de listagem, formulário e detalhes de alunos.

    turmas/ → Componente de gerenciamento de turmas.

    professores/ → Componente de cadastro e edição de professores.

    cursos/ → Componente de administração de cursos.

Serviços

    aluno.service.ts → Consome API de alunos.

    turma.service.ts → Consome API de turmas.

    professor.service.ts → Consome API de professores.

    curso.service.ts → Consome API de cursos.

🗄️ Modelo Físico do Banco (MySQL)
sql

CREATE TABLE cursos (
  id_curso INT AUTO_INCREMENT PRIMARY KEY,
  nome_curso VARCHAR(100) NOT NULL,
  descricao TEXT,
  carga_horaria INT NOT NULL
);

CREATE TABLE professores (
  id_professor INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especialidade VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(20)
);

CREATE TABLE turmas (
  id_turma INT AUTO_INCREMENT PRIMARY KEY,
  nome_turma VARCHAR(50) NOT NULL,
  ano INT NOT NULL,
  id_curso INT,
  id_professor INT,
  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
  FOREIGN KEY (id_professor) REFERENCES professores(id_professor)
);

CREATE TABLE alunos (
  id_aluno INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(20),
  id_turma INT,
  FOREIGN KEY (id_turma) REFERENCES turmas(id_turma)
);

🔒 Segurança

    Autenticação via JWT.

    Perfis de acesso: Administrador, Professor, Aluno.

    Criptografia de senhas com bcrypt.

    Validação de dados no backend e frontend.