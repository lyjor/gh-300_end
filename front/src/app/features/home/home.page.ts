import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="intro">
        <p class="eyebrow">Painel operacional</p>
        <h2>Administração escolar com foco em CRUD, segurança e rastreabilidade.</h2>
        <p>
          A base do front foi separada por domínio e preparada para integrar listagem,
          formulário, detalhe e rotas protegidas para cada entidade.
        </p>
      </div>

      <div class="cards">
        <a routerLink="/alunos" class="card">
          <span>Alunos</span>
          <strong>Cadastro, edição e vínculo com turmas.</strong>
        </a>
        <a routerLink="/turmas" class="card">
          <span>Turmas</span>
          <strong>Relação entre curso e professor responsável.</strong>
        </a>
        <a routerLink="/professores" class="card">
          <span>Professores</span>
          <strong>Perfis e dados de contato.</strong>
        </a>
        <a routerLink="/cursos" class="card">
          <span>Cursos</span>
          <strong>Base curricular e carga horária.</strong>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      gap: 24px;
    }

    .intro,
    .card {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: 28px;
      box-shadow: var(--shadow);
    }

    .intro {
      padding: 28px;
    }

    .eyebrow {
      margin: 0 0 10px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.78rem;
    }

    h2 {
      margin: 0 0 12px;
      font-size: clamp(2rem, 3vw, 3.8rem);
      line-height: 1.04;
      max-width: 13ch;
    }

    p {
      margin: 0;
      color: var(--muted);
      max-width: 70ch;
      line-height: 1.7;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .card {
      display: block;
      padding: 24px;
      text-decoration: none;
      transition: transform 160ms ease, border-color 160ms ease;
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(15, 118, 110, 0.25);
    }

    .card span {
      display: inline-block;
      margin-bottom: 8px;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--primary);
    }

    .card strong {
      display: block;
      font-size: 1.05rem;
      line-height: 1.5;
    }

    @media (max-width: 720px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomePage {}