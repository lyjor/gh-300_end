import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

interface CursoListItem {
  idCurso: number;
  nomeCurso: string;
  descricao: string | null;
  cargaHoraria: number;
  turmas?: { idTurma: number }[];
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="panel">
      <div class="heading">
        <div>
          <p class="eyebrow">CRUD operacional</p>
          <h2>Cursos</h2>
          <p>Gerencie a base curricular e a carga horária do sistema.</p>
        </div>
        <button type="button" class="secondary" (click)="reload()" [disabled]="loading">Recarregar</button>
      </div>

      <p class="message" *ngIf="message">{{ message }}</p>

      <div class="layout">
        <div class="card table-card">
          <div class="card-header">
            <h3>Lista</h3>
            <span>{{ cursos.length }} registros</span>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Carga horária</th>
                  <th>Turmas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (curso of cursos; track curso.idCurso) {
                  <tr>
                    <td>{{ curso.nomeCurso }}</td>
                    <td>{{ curso.descricao || '-' }}</td>
                    <td>{{ curso.cargaHoraria }}</td>
                    <td>{{ curso.turmas?.length || 0 }}</td>
                    <td class="actions">
                      <button type="button" (click)="edit(curso)">Editar</button>
                      <button type="button" class="danger" (click)="remove(curso.idCurso)">Excluir</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <form class="card form-card" [formGroup]="form" (ngSubmit)="save()">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar curso' : 'Novo curso' }}</h3>
            <span>Formulário</span>
          </div>

          <label>
            Nome do curso
            <input type="text" formControlName="nomeCurso" />
          </label>

          <label>
            Descrição
            <textarea rows="5" formControlName="descricao"></textarea>
          </label>

          <label>
            Carga horária
            <input type="number" formControlName="cargaHoraria" />
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
    input,select,textarea{padding:13px 14px;border-radius:14px;border:1px solid var(--border);background:white;font:inherit;}
    textarea{resize:vertical;}
    .form-actions{justify-content:flex-start;margin-top:4px;}
    @media (max-width:1100px){.layout{grid-template-columns:1fr;}}
  `]
})
export class CursosPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  cursos: CursoListItem[] = [];
  loading = false;
  message = '';
  editingId: number | null = null;

  readonly form = this.formBuilder.group({
    nomeCurso: ['', [Validators.required, Validators.minLength(3)]],
    descricao: [null as string | null],
    cargaHoraria: [800, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.apiService
      .get<CursoListItem[]>('/cursos')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (cursos) => (this.cursos = cursos),
        error: () => {
          this.message = 'Não foi possível carregar os cursos.';
        }
      });
  }

  save() {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      nomeCurso: value.nomeCurso,
      descricao: value.descricao || null,
      cargaHoraria: Number(value.cargaHoraria)
    };

    this.loading = true;
    const request = this.editingId
      ? this.apiService.put<CursoListItem>(`/cursos/${this.editingId}`, payload)
      : this.apiService.post<CursoListItem>('/cursos', payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.message = this.editingId ? 'Curso atualizado com sucesso.' : 'Curso criado com sucesso.';
        this.resetForm();
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível salvar o curso.';
      }
    });
  }

  edit(curso: CursoListItem) {
    this.editingId = curso.idCurso;
    this.form.patchValue({ nomeCurso: curso.nomeCurso, descricao: curso.descricao, cargaHoraria: curso.cargaHoraria });
  }

  remove(id: number) {
    if (!confirm('Excluir este curso?')) {
      return;
    }

    this.apiService.delete(`/cursos/${id}`).subscribe({
      next: () => {
        this.message = 'Curso excluído com sucesso.';
        this.reload();
      },
      error: () => {
        this.message = 'Não foi possível excluir o curso.';
      }
    });
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({ nomeCurso: '', descricao: null, cargaHoraria: 800 });
  }
}