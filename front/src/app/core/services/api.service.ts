import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string) {
    return this.httpClient.get<T>(`${this.baseUrl}${path}`);
  }

  post<T>(path: string, body: unknown) {
    return this.httpClient.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown) {
    return this.httpClient.put<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string) {
    return this.httpClient.delete<T>(`${this.baseUrl}${path}`);
  }
}