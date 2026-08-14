import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel">
      <p class="eyebrow">Acesso seguro</p>
      <h2>Entre para operar o sistema.</h2>
      <p>
        Use o usuário administrativo inicial para liberar as rotas protegidas e executar o CRUD.
      </p>
      <form [formGroup]="loginForm" (ngSubmit)="submit()" class="form">
        <label>
          E-mail
          <input type="email" formControlName="email" placeholder="admin@escola.local" />
        </label>

        <label>
          Senha
          <input type="password" formControlName="password" placeholder="Admin@123" />
        </label>

        <button type="submit" [disabled]="loading || loginForm.invalid">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        @if (loginForm.controls.password.errors?.['invalidCredentials']) {
          <div class="notice">Credenciais inválidas.</div>
        }
      </form>
    </section>
  `,
  styles: [`
    .panel {
      max-width: 760px;
      padding: 28px;
      border-radius: 28px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .eyebrow {
      margin: 0 0 8px;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.78rem;
    }

    h2 {
      margin: 0 0 10px;
      font-size: clamp(1.8rem, 2.5vw, 2.8rem);
    }

    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .form {
      display: grid;
      gap: 14px;
      margin-top: 20px;
    }

    label {
      display: grid;
      gap: 8px;
      font-size: 0.95rem;
      color: var(--text);
    }

    input {
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: var(--surface-strong);
      color: var(--text);
      outline: none;
    }

    input:focus {
      border-color: rgba(15, 118, 110, 0.45);
      box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.08);
    }

    button {
      margin-top: 6px;
      padding: 14px 18px;
      border: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .notice {
      margin-top: 18px;
      padding: 16px 18px;
      border-radius: 20px;
      background: rgba(15, 118, 110, 0.08);
      color: var(--text);
      line-height: 1.6;
    }
  `]
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  readonly loginForm = this.formBuilder.group({
    email: this.formBuilder.control('admin@escola.local', [Validators.required, Validators.email]),
    password: this.formBuilder.control('Admin@123', [Validators.required, Validators.minLength(8)])
  });

  submit() {
    if (this.loginForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/alunos');
        },
        error: () => {
          this.loginForm.controls.password.setErrors({ invalidCredentials: true });
        }
      });
  }
}