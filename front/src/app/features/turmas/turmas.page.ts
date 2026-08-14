import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

interface CursoOption {
  idCurso: number;
  nomeCurso: string;
}

interface ProfessorOption {
  idProfessor: number;
  nome: string;
}

interface TurmaListItem {
  idTurma: number;
  nomeTurma: string;
  ano: number;
  curso: CursoOption | null;
  professor: ProfessorOption | null;
  alunos: { idAluno: number }[];
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel">
      <div class="heading">
        <div>
          <p class="eyebrow">CRUD operacional</p>
          <h2>Turmas</h2>
          <p>Organização das turmas com vínculo para curso e professor.</p>
        </div>
        <button type="button" class="secondary" (click)="reload()" [disabled]="loading">Recarregar</button>
      </div>

      <p class="message" *ngIf="message">{{ message }}</p>

      <div class="layout">
        <div class="card table-card">
          <div class="card-header">
            <h3>Lista</h3>
            <span>{{ turmas.length }} registros</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Ano</th>
                  <th>Curso</th>
                  <th>Professor</th>
                  <th>Alunos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (turma of turmas; track turma.idTurma) {
                  <tr>
                    <td>{{ turma.nomeTurma }}</td>
                    <td>{{ turma.ano }}</td>
                    <td>{{ turma.curso?.nomeCurso || '-' }}</td>
                    <td>{{ turma.professor?.nome || '-' }}</td>
                    <td>{{ turma.alunos.length }}</td>
                    <td class="actions">
                      <button type="button" (click)="edit(turma)">Editar</button>
                      <button type="button" class="danger" (click)="remove(turma.idTurma)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <form class="card form-card" [formGroup]="form" (ngSubmit)="save()">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar turma' : 'Nova turma' }}</h3>
            <span>Formulário</span>
          </div>

          <label>
            Nome da turma
            <input type="text" formControlName="nomeTurma" />
          </label>

          <label>
            Ano
            <input type="number" formControlName="ano" />
          </label>

          <label>
            Curso
            <select formControlName="idCurso">
              <option [ngValue]="null">Sem curso</option>
              @for (curso of cursos; track curso.idCurso) {
                <option [ngValue]="curso.idCurso">{{ curso.nomeCurso }}</option>
              }
            </select>
          </label>

          <label>
            Professor
            <select formControlName="idProfessor">
              <option [ngValue]="null">Sem professor</option>
              @for (professor of professores; track professor.idProfessor) {
                <option [ngValue]="professor.idProfessor">{{ professor.nome }}</option>
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
export class TurmasPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  turmas: TurmaListItem[] = [];
  cursos: CursoOption[] = [];
  professores: ProfessorOption[] = [];
  loading = false;
  message = '';
  editingId: number | null = null;

  readonly form = this.formBuilder.group({
    nomeTurma: ['', [Validators.required, Validators.minLength(2)]],
    ano: [2026, [Validators.required, Validators.min(2000)]],
    idCurso: [null as number | null],
    idProfessor: [null as number | null]
  });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    forkJoin({
      turmas: this.apiService.get<TurmaListItem[]>('/turmas'),
      cursos: this.apiService.get<CursoOption[]>('/cursos'),
      professores: this.apiService.get<ProfessorOption[]>('/professores')
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ turmas, cursos, professores }) => {
          this.turmas = turmas;
          this.cursos = cursos;
          this.professores = professores;
        },
        error: () => {
          this.message = 'Não foi possível carregar as turmas.';
        }
      });
  }

  save() {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      nomeTurma: value.nomeTurma,
      ano: Number(value.ano),
      idCurso: value.idCurso ?? null,
      idProfessor: value.idProfessor ?? null
    };

    this.loading = true;
    const request = this.editingId
      ? this.apiService.put<TurmaListItem>(`/turmas/${this.editingId}`, payload)
      : this.apiService.post<TurmaListItem>('/turmas', payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.message = this.editingId ? 'Turma atualizada com sucesso.' : 'Turma criada com sucesso.';
        this.resetForm();
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível salvar a turma.';
      }
    });
  }

  edit(turma: TurmaListItem) {
    this.editingId = turma.idTurma;
    this.form.patchValue({
      nomeTurma: turma.nomeTurma,
      ano: turma.ano,
      idCurso: turma.curso?.idCurso ?? null,
      idProfessor: turma.professor?.idProfessor ?? null
    });
  }

  remove(id: number) {
    if (!confirm('Excluir esta turma?')) {
      return;
    }

    this.apiService.delete(`/turmas/${id}`).subscribe({
      next: () => {
        this.message = 'Turma excluída com sucesso.';
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível excluir a turma.';
      }
    });
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({ nomeTurma: '', ano: 2026, idCurso: null, idProfessor: null });
  }
}