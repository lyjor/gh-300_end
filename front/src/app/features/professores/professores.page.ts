import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

interface ProfessorListItem {
  idProfessor: number;
  nome: string;
  especialidade: string | null;
  email: string | null;
  telefone: string | null;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel">
      <div class="heading">
        <div>
          <p class="eyebrow">CRUD operacional</p>
          <h2>Professores</h2>
          <p>Cadastro e manutenção dos dados de contato e especialidade.</p>
        </div>
        <button type="button" class="secondary" (click)="reload()" [disabled]="loading">Recarregar</button>
      </div>

      <p class="message" *ngIf="message">{{ message }}</p>

      <div class="layout">
        <div class="card table-card">
          <div class="card-header">
            <h3>Lista</h3>
            <span>{{ professores.length }} registros</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Especialidade</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (professor of professores; track professor.idProfessor) {
                  <tr>
                    <td>{{ professor.nome }}</td>
                    <td>{{ professor.especialidade || '-' }}</td>
                    <td>{{ professor.email || '-' }}</td>
                    <td>{{ professor.telefone || '-' }}</td>
                    <td class="actions">
                      <button type="button" (click)="edit(professor)">Editar</button>
                      <button type="button" class="danger" (click)="remove(professor.idProfessor)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <form class="card form-card" [formGroup]="form" (ngSubmit)="save()">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar professor' : 'Novo professor' }}</h3>
            <span>Formulário</span>
          </div>

          <label>
            Nome
            <input type="text" formControlName="nome" />
          </label>

          <label>
            Especialidade
            <input type="text" formControlName="especialidade" />
          </label>

          <label>
            E-mail
            <input type="email" formControlName="email" />
          </label>

          <label>
            Telefone
            <input type="text" formControlName="telefone" />
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
export class ProfessoresPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  professores: ProfessorListItem[] = [];
  loading = false;
  message = '';
  editingId: number | null = null;

  readonly form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    especialidade: [null as string | null],
    email: [null as string | null, [Validators.email]],
    telefone: [null as string | null]
  });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.apiService
      .get<ProfessorListItem[]>('/professores')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (professores) => (this.professores = professores),
        error: () => {
          this.message = 'Não foi possível carregar os professores.';
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
      especialidade: value.especialidade || null,
      email: value.email || null,
      telefone: value.telefone || null
    };

    this.loading = true;
    const request = this.editingId
      ? this.apiService.put<ProfessorListItem>(`/professores/${this.editingId}`, payload)
      : this.apiService.post<ProfessorListItem>('/professores', payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.message = this.editingId ? 'Professor atualizado com sucesso.' : 'Professor criado com sucesso.';
        this.resetForm();
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível salvar o professor.';
      }
    });
  }

  edit(professor: ProfessorListItem) {
    this.editingId = professor.idProfessor;
    this.form.patchValue({
      nome: professor.nome,
      especialidade: professor.especialidade,
      email: professor.email,
      telefone: professor.telefone
    });
  }

  remove(id: number) {
    if (!confirm('Excluir este professor?')) {
      return;
    }

    this.apiService.delete(`/professores/${id}`).subscribe({
      next: () => {
        this.message = 'Professor excluído com sucesso.';
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível excluir o professor.';
      }
    });
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({ nome: '', especialidade: null, email: null, telefone: null });
  }
}