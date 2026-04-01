import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  formModel:any={}
  showError:boolean = false;
  errorMessage:any
  isLoading:boolean = false
  constructor(private httpService:HttpService, private fb: FormBuilder, private router:Router, private authService:AuthService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 // login.component.ts
onLogin() {
  if (this.itemForm.invalid) return;
 

  this.httpService.Login(this.itemForm.value).subscribe({
    next: (response: any) => {
      // 1. Save Token (Crucial for JWT/Bcrypt flow)
      if (response.token) {
        this.authService.saveToken(response.token);
      }
      
      // 2. Save Role if your app uses role-based access
      if (response.role) {
      
        this.authService.SetRole(response.role);
        if(response.role==='TECHNICIAN'){
        this.router.navigate(['/maintenance']);
      }
      if(response.role === 'HOSPITAL'){
        this.router.navigate(['/createhospital']);
      }
      if(response.role ==='SUPPLIER'){
        this.router.navigate(['/orders']);
      }
      }
      

      // 3. Navigate to createhospital
      
    },
    error: (err) => {
      this.errorMessage = "Invalid credentials";
    }
  });
}




  registration(){
    this.router.navigate(['/registration'])
  }
}



