import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = false; // 1. Default to false

  constructor() {
    this.token = localStorage.getItem('token');
    // 2. FIX: If token exists, isLoggedIn should be TRUE
    this.isLoggedIn = !!this.token; 
  }

  saveToken(token: string) {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  SetRole(role: any) {
    localStorage.setItem('role', role);
  }

  get getRole(): string | null {
    return localStorage.getItem('role');
  }

  // 3. Simplified login status check
  get getLoginStatus(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  logout() {
    this.isLoggedIn = false;
    this.token = null;
    localStorage.clear();
  }
}
