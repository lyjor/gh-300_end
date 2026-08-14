USE `porto-08`;

INSERT INTO cursos (nome_curso, descricao, carga_horaria)
VALUES ('Ensino Fundamental', 'Base para o ciclo educacional', 800),
       ('Ensino Médio', 'Formação regular do ensino médio', 1200);

INSERT INTO professores (nome, especialidade, email, telefone)
VALUES ('Ana Souza', 'Matemática', 'ana.souza@escola.local', '+55 11 99999-0001'),
       ('Carlos Lima', 'História', 'carlos.lima@escola.local', '+55 11 99999-0002');

INSERT INTO turmas (nome_turma, ano, id_curso, id_professor)
VALUES ('7A', 2026, 1, 1),
       ('1B', 2026, 2, 2);

INSERT INTO alunos (nome, data_nascimento, email, telefone, id_turma)
VALUES ('Mariana Costa', '2011-04-12', 'mariana.costa@escola.local', '+55 11 98888-0001', 1),
       ('João Pereira', '2010-09-18', 'joao.pereira@escola.local', '+55 11 98888-0002', 2);

INSERT INTO usuarios (nome, email, senha_hash, papel, ativo)
VALUES ('Administrador', 'admin@escola.local', '$2y$10$IlOZzFNxZnFV4gttdJlq4.IbTbu5Oj2FKncrR3zpmrGylnJPRr7Dq', 'ADMIN', TRUE);