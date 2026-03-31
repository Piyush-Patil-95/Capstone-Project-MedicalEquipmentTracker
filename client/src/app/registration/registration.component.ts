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

  onRegister(): void {
    this.showMessage = false;

    if (this.itemForm.valid) {
      // Mapping form values to your model for the API call
      this.httpService.registerUser(this.itemForm.value).subscribe({
        next: (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Registration Successful!";
          // Redirect to login after a brief delay
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err: any) => {
          this.showMessage = true;
          console.log('Full error details', err)
          this.responseMessage = err.error?.message || "Registration failed. Please try again.";
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
