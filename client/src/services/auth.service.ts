import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = false;

  constructor() {
    this.token=localStorage.getItem('token')
    this.isLoggedIn=!this.token;
  }

  
  saveToken(token: string) {
  this.token=token;
  this.isLoggedIn=true;
  localStorage.setItem('token',token);
  }
   SetRole(role:any)
  {
     localStorage.setItem('role',role);
  }
  get getRole ():string|null
  {
    return localStorage.getItem('role');
  }
  // Method to retrieve login status
  get getLoginStatus(): boolean {
   return !!localStorage.getItem('token') || this.isLoggedIn;
   
  }
  getToken(): string | null {
   return this.token;
  }
  logout(){
    this.isLoggedIn=false;
    this.token=null;
    localStorage.clear()
   }
}
