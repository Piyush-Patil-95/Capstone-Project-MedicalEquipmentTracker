import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = false;

  constructor() {}

  // Method to save token received from login
  saveToken(token: string) {
  //please complete this
  }
   SetRole(role:any)
  {
     //please complete this
  }
  get getRole ():string|null
  {
    return localStorage.getItem('role');
  }
  // Method to retrieve login status
  get getLoginStatus(): boolean {
  
      //please complete this
   
  }
  getToken(): string | null {
  //please complete this
  }
  logout(){
    //please complete this
   }
}
