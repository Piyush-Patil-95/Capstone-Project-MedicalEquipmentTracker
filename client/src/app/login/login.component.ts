import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';



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

  onLogin() {
  this.showError = false;
  if (this.itemForm.invalid) {
    this.itemForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  this.httpService.Login(this.itemForm.value).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      
      // Use the keys from your JSON: "token" and "role"
      if (response && response.token) {
        this.authService.saveToken(response.token);
      }
      
      if (response && response.role) {
        this.authService.SetRole(response.role);
      }

      // Final Step: Navigate to dashboard
      console.log("Login successful, navigating to dashboard...");
      this.router.navigate(['/createhospital']).then(success => {
        if (!success) {
          console.error("Navigation failed! Check your AppRoutingModule.");
        }
      });
    },
    error: (err) => {
      this.isLoading = false;
      this.showError = true;
      this.errorMessage = err.error?.message || "Login failed. Check your credentials.";
    }
  });
}



  registration(){
    this.router.navigate(['/registration'])
  }
}



