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
      username: ['', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern('^[A-Za-z]+$')
  ]],
  email: ['', [
    Validators.required,
    Validators.email
  ]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
  ]],
  role: ['', Validators.required]
    });
  }

  // registration.component.ts
  successMessage:string = '';
onRegister(): void {
  if (this.itemForm.valid) {
    this.httpService.registerUser(this.itemForm.value).subscribe({
     
    });

    this.successMessage = 'Registration successful!';

  this.itemForm.reset();
  }
}




  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
