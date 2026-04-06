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

  itemForm!: FormGroup;
  successMessage: string = '';
  roles: string[] = ['HOSPITAL', 'SUPPLIER', 'TECHNICIAN'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username:     ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-Za-z]+$')]],
      email:        ['', [Validators.required, Validators.email]],
      password:     ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]],
      role:         ['', Validators.required],
      hospitalName: [''],
      location:     [''],
      fullName:     ['']
    });

    // React to role changes — set/clear validators dynamically
    this.itemForm.get('role')?.valueChanges.subscribe(role => {
      this.clearConditionalValidators();

      if (role === 'HOSPITAL') {
        this.itemForm.get('hospitalName')?.setValidators([Validators.required]);
        this.itemForm.get('location')?.setValidators([Validators.required]);
      } else if (role === 'SUPPLIER' || role === 'TECHNICIAN') {
        this.itemForm.get('fullName')?.setValidators([Validators.required]);
      }

      // Trigger re-validation
      ['hospitalName', 'location', 'fullName'].forEach(field =>
        this.itemForm.get(field)?.updateValueAndValidity()
      );
    });
  }

  clearConditionalValidators() {
    ['hospitalName', 'location', 'fullName'].forEach(field => {
      this.itemForm.get(field)?.clearValidators();
      this.itemForm.get(field)?.reset('');
      this.itemForm.get(field)?.updateValueAndValidity();
    });
  }

  onRegister(): void {
    if (this.itemForm.valid) {
      this.httpService.registerUser(this.itemForm.value).subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          this.itemForm.reset();
        },
        error: () => {
          this.successMessage = 'Registration failed. Please try again.';
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}