import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Sistema de Administração Escolar</p>
          <h1>Escola</h1>
        </div>
        <nav>
          <a routerLink="/">Visão geral</a>
          <a routerLink="/alunos">Alunos</a>
          <a routerLink="/turmas">Turmas</a>
          <a routerLink="/professores">Professores</a>
          <a routerLink="/cursos">Cursos</a>
          @if (authService.isAuthenticated()) {
            <button type="button" (click)="logout()">Sair</button>
          } @else {
            <a routerLink="/login">Acesso</a>
          }
        </nav>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      padding: 32px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.2));
      backdrop-filter: blur(16px);
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 24px 28px;
      border: 1px solid var(--border);
      border-radius: 28px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .eyebrow {
      margin: 0 0 6px;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--muted);
    }

    h1 {
      margin: 0;
      font-size: clamp(1.5rem, 2vw, 2.2rem);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
    }

    nav a {
      text-decoration: none;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid transparent;
      color: var(--muted);
      transition: 160ms ease;
    }

    nav button {
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      transition: 160ms ease;
    }

    nav button:hover {
      background: rgba(16, 33, 47, 0.04);
      color: var(--text);
    }

    nav a:hover {
      border-color: var(--border);
      background: rgba(16, 33, 47, 0.04);
      color: var(--text);
    }

    .content {
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 0 0;
    }

    @media (max-width: 900px) {
      .topbar {
        flex-direction: column;
        align-items: stretch;
      }

      nav {
        justify-content: flex-start;
      }
    }
  `]
})
export class AppComponent {
  readonly authService = inject(AuthService);

  logout() {
    this.authService.clearToken();
    window.location.href = '/login';
  }
}