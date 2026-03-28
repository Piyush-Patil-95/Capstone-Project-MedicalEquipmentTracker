import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = true;

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
<<<<<<< HEAD
  // get getLoginStatus(): boolean {
  
  //     //please complete this
   
  // }
  // getToken(): string | null {
  // //please complete this
  // }
=======
  get getLoginStatus(): boolean {
   return !!localStorage.getItem('token') || this.isLoggedIn;
   
  }
  getToken(): string | null {
   return this.token;
  }
>>>>>>> a12018e0c757cf6d91df533619a84d10dd72561f
  logout(){
    this.isLoggedIn=false;
    this.token=null;
    localStorage.clear()
   }
}
