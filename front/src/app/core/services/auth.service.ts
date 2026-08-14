import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

const tokenKey = 'escola.auth.token';

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);

  token(): string | null {
    return localStorage.getItem(tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  setToken(token: string) {
    localStorage.setItem(tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(tokenKey);
  }

  login(credentials: LoginCredentials) {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => this.setToken(response.token))
    );
  }
}