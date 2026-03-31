import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  // Your specific variables
  itemForm!: FormGroup; 
  formModel: any = { role: null, email: '', password: '', username: '' }; 
  showMessage: boolean = false; 
  responseMessage: any; 
  
  // Array for the dropdown options
  roles: string[] = ['HOSPITAL', 'SUPPLIER', 'TECHNICIAN'];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    // Initialize form with your formModel values
    this.itemForm = this.fb.group({
      username: [this.formModel.username, Validators.required],
      email: [this.formModel.email, [Validators.required, Validators.email]],
      password: [this.formModel.password, [Validators.required, Validators.minLength(6)]],
      role: [this.formModel.role, Validators.required]
    });
  }

  // registration.component.ts
onRegister(): void {
  if (this.itemForm.valid) {
    this.httpService.registerUser(this.itemForm.value).subscribe({
      next: (res: any) => {
        // Registration successful, now move to login
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.responseMessage = err.error?.message || "Registration failed";
      }
    });
  }
}


  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
