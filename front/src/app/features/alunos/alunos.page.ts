import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

interface AlunoListItem {
  idAluno: number;
  nome: string;
  dataNascimento: string | null;
  email: string | null;
  telefone: string | null;
  turma: { idTurma: number; nomeTurma: string; ano: number } | null;
}

interface TurmaOption {
  idTurma: number;
  nomeTurma: string;
  ano: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel">
      <div class="heading">
        <div>
          <p class="eyebrow">CRUD operacional</p>
          <h2>Alunos</h2>
          <p>Cadastro, edição, exclusão e vínculo com turmas.</p>
        </div>
        <button type="button" class="secondary" (click)="reload()" [disabled]="loading">Recarregar</button>
      </div>

      <p class="message" *ngIf="message">{{ message }}</p>

      <div class="layout">
        <div class="card table-card">
          <div class="card-header">
            <h3>Lista</h3>
            <span>{{ alunos.length }} registros</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Turma</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (aluno of alunos; track aluno.idAluno) {
                  <tr>
                    <td>{{ aluno.nome }}</td>
                    <td>{{ aluno.email || '-' }}</td>
                    <td>{{ aluno.telefone || '-' }}</td>
                    <td>{{ turmaLabel(aluno.turma) }}</td>
                    <td class="actions">
                      <button type="button" (click)="edit(aluno)">Editar</button>
                      <button type="button" class="danger" (click)="remove(aluno.idAluno)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <form class="card form-card" [formGroup]="form" (ngSubmit)="save()">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar aluno' : 'Novo aluno' }}</h3>
            <span>Formulário</span>
          </div>

          <label>
            Nome
            <input type="text" formControlName="nome" />
          </label>

          <label>
            Data de nascimento
            <input type="date" formControlName="dataNascimento" />
          </label>

          <label>
            E-mail
            <input type="email" formControlName="email" />
          </label>

          <label>
            Telefone
            <input type="text" formControlName="telefone" />
          </label>

          <label>
            Turma
            <select formControlName="idTurma">
              <option [ngValue]="null">Sem turma</option>
              @for (turma of turmas; track turma.idTurma) {
                <option [ngValue]="turma.idTurma">{{ turma.nomeTurma }} - {{ turma.ano }}</option>
              }
            </select>
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="loading || form.invalid">
              {{ editingId ? 'Atualizar' : 'Cadastrar' }}
            </button>
            @if (editingId) {
              <button type="button" class="secondary" (click)="resetForm()">Cancelar</button>
            }
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .panel { padding: 28px; border-radius: 28px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--shadow); }
    .heading,.card-header,.form-actions,.actions { display:flex; gap:12px; align-items:center; justify-content:space-between; }
    .heading{align-items:flex-start;margin-bottom:20px;}
    .eyebrow{margin:0 0 8px;color:var(--accent);text-transform:uppercase;letter-spacing:.14em;font-size:.76rem;}
    h2,h3{margin:0;}
    p{margin:8px 0 0;color:var(--muted);line-height:1.6;}
    .message{margin:0 0 16px;padding:12px 14px;border-radius:14px;background:rgba(15,118,110,.08);color:var(--primary-strong);}
    .layout{display:grid;grid-template-columns:1.5fr 1fr;gap:18px;}
    .card{padding:18px;border-radius:22px;background:var(--surface-strong);border:1px solid var(--border);}
    .card-header span{color:var(--muted);font-size:.85rem;}
    .table-wrap{overflow:auto;}
    table{width:100%;border-collapse:collapse;}
    th,td{padding:12px 10px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top;}
    th{font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);}
    .actions{justify-content:flex-start;flex-wrap:wrap;}
    .actions button,.secondary,.form-actions button{border:0;border-radius:14px;padding:10px 14px;cursor:pointer;background:rgba(15,118,110,.1);color:var(--primary-strong);font-weight:700;}
    .danger{background:rgba(185,28,28,.1)!important;color:#991b1b!important;}
    .form-card{display:grid;gap:14px;align-content:start;}
    label{display:grid;gap:8px;color:var(--text);font-size:.92rem;}
    input,select{padding:13px 14px;border-radius:14px;border:1px solid var(--border);background:white;}
    .form-actions{justify-content:flex-start;margin-top:4px;}
    @media (max-width:1100px){.layout{grid-template-columns:1fr;}}
  `]
})
export class AlunosPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  alunos: AlunoListItem[] = [];
  turmas: TurmaOption[] = [];
  loading = false;
  message = '';
  editingId: number | null = null;

  readonly form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    dataNascimento: [null as string | null],
    email: [null as string | null, [Validators.email]],
    telefone: [null as string | null],
    idTurma: [null as number | null]
  });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    forkJoin({
      alunos: this.apiService.get<AlunoListItem[]>('/alunos'),
      turmas: this.apiService.get<TurmaOption[]>('/turmas')
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ alunos, turmas }) => {
          this.alunos = alunos;
          this.turmas = turmas;
        },
        error: () => {
          this.message = 'Não foi possível carregar os alunos.';
        }
      });
  }

  save() {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      nome: value.nome,
      dataNascimento: value.dataNascimento || null,
      email: value.email || null,
      telefone: value.telefone || null,
      idTurma: value.idTurma ?? null
    };

    this.loading = true;
    const request = this.editingId
      ? this.apiService.put<AlunoListItem>(`/alunos/${this.editingId}`, payload)
      : this.apiService.post<AlunoListItem>('/alunos', payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.message = this.editingId ? 'Aluno atualizado com sucesso.' : 'Aluno criado com sucesso.';
        this.resetForm();
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível salvar o aluno.';
      }
    });
  }

  edit(aluno: AlunoListItem) {
    this.editingId = aluno.idAluno;
    this.form.patchValue({
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : null,
      email: aluno.email,
      telefone: aluno.telefone,
      idTurma: aluno.turma?.idTurma ?? null
    });
  }

  remove(id: number) {
    if (!confirm('Excluir este aluno?')) {
      return;
    }

    this.apiService.delete(`/alunos/${id}`).subscribe({
      next: () => {
        this.message = 'Aluno excluído com sucesso.';
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível excluir o aluno.';
      }
    });
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({ nome: '', dataNascimento: null, email: null, telefone: null, idTurma: null });
  }

  turmaLabel(turma: AlunoListItem['turma']) {
    return turma ? `${turma.nomeTurma} - ${turma.ano}` : '-';
  }
}