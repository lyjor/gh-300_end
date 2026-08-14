import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((module) => module.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then((module) => module.LoginPage)
  },
  {
    path: 'alunos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/alunos/alunos.page').then((module) => module.AlunosPage)
  },
  {
    path: 'turmas',
    canActivate: [authGuard],
    loadComponent: () => import('./features/turmas/turmas.page').then((module) => module.TurmasPage)
  },
  {
    path: 'professores',
    canActivate: [authGuard],
    loadComponent: () => import('./features/professores/professores.page').then((module) => module.ProfessoresPage)
  },
  {
    path: 'cursos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cursos/cursos.page').then((module) => module.CursosPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];