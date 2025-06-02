import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';
  private tokenKey = 'access_token';
  private timeoutId: any;
  private sessionExpiredSubject = new Subject<void>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.setupInactivityTimer();
  }

  register(user: { email: string; first_name: string; last_name: string; password: string }): Observable<AuthResponse> {
    user.email = user.email.toLowerCase();
    return this.http.post<AuthResponse>(`${this.apiUrl}register/`, user).pipe(
      tap(res => this.saveToken(res.access))
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    credentials.email = credentials.email.toLowerCase();
    return this.http.post<AuthResponse>(`${this.apiUrl}login/`, credentials).pipe(
      tap(res => {
        this.saveToken(res.access);
        this.resetTimer();
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}profile/`);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    clearTimeout(this.timeoutId);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setupInactivityTimer() {
    document.addEventListener('click', () => this.resetTimer());
    document.addEventListener('mousemove', () => this.resetTimer());
    document.addEventListener('keydown', () => this.resetTimer());
  }

  resetTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.sessionExpiredSubject.next();
    }, 5 * 60 * 1000);
  }
}