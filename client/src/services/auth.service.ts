import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  SetRole(role: string) {
    localStorage.setItem('role', role);
  }

  get getRole(): string {
    return localStorage.getItem('role') || '';
  }

  get getLoginStatus(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
  }
}