import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/types/user';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.api}`;
  private http = inject(HttpClient);

  private router = inject(Router);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (!this.isBrowser()) return;
    const token = localStorage.getItem('token');
    if (token) {
      this._token.set(token);
      this._isAuthenticated.set(true);
    } else {
      this._isAuthenticated.set(false);
    }
  }

  login(
    email: string,
    senha: string,
    captcha: string,
    captchaResposta: string
  ): Observable<{ message: string; token: string }> {
    return new Observable((observer) => {
      this.http
        .post<{ message: string; token: string }>(
          `${this.baseUrl}/auth/login`,
          {
            email,
            senha,
            captcha,
            captchaResposta,
          }
        )
        .subscribe({
          next: (response) => {
            this.saveToken(response.token);
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  register(
    email: string,
    senha: string,
    captcha: string,
    captchaResposta: string
  ): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/user/register`, {
      email,
      senha,
      captcha,
      captchaResposta,
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${email}`);
  }

  generateCaptcha(): Observable<{ captcha: string }> {
    return this.http.post<{ captcha: string }>(
      `${this.baseUrl}/auth/generate-captcha`,
      {}
    );
  }

  resetPassword(
    email: string
  ): Observable<{ message: string; novaSenha: string }> {
    return this.http.put<{ message: string; novaSenha: string }>(
      `${this.baseUrl}/user/redefinir-senha`,
      { email }
    );
  }

  generateAuthCode(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/auth/generate-auth-code`,
      { email }
    );
  }

  verifyCode(
    email: string,
    code: string
  ): Observable<{ message: string; token: string }> {
    return new Observable((observer) => {
      this.http
        .post<{ message: string; token: string }>(
          `${this.baseUrl}/auth/verify-code`,
          {
            email,
            code,
          }
        )
        .subscribe({
          next: (response) => {
            this.saveToken(response.token);
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  logout(): void {
    this._token.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private saveToken(token: string): void {
    this._token.set(token);
    this._isAuthenticated.set(true);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getToken(): string | null {
    return this._token();
  }

  checkAuthentication(): boolean {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return false;
    }
    this._isAuthenticated.set(true);
    return true;
  }
}
