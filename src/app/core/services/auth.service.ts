import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiBaseUrl;

  private TOKEN_KEY = 'token';
  private ROLE_KEY = 'role';
  private USER_KEY = 'user';

  constructor(private http: HttpClient) {}

  // ================= API =================

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      data
    );
  }

  // ================= TOKEN =================

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ================= ROLE =================

  setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  // ================= USER =================

  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user.email));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // ================= AUTH HELPERS =================

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}