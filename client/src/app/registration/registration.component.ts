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
  errorMessage: string = '';
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

      // Trigger re-validation on conditional fields
      ['hospitalName', 'location', 'fullName'].forEach(field =>
        this.itemForm.get(field)?.updateValueAndValidity()
      );
    });
  }

  clearConditionalValidators(): void {
    ['hospitalName', 'location', 'fullName'].forEach(field => {
      const control = this.itemForm.get(field);
      control?.clearValidators();
      control?.setValue('');          // FIX: setValue instead of reset() to avoid marking as touched
      control?.updateValueAndValidity();
    });
  }

  onRegister(): void {
    // FIX: Mark all fields as touched so validation errors show on submit
    this.itemForm.markAllAsTouched();

    if (this.itemForm.invalid) return;

    // FIX: Build payload — only include fields relevant to the selected role
    const role = this.itemForm.value.role;
    const payload: any = {
      username: this.itemForm.value.username,
      email:    this.itemForm.value.email,
      password: this.itemForm.value.password,
      role:     role
    };

    if (role === 'HOSPITAL') {
      payload.hospitalName = this.itemForm.value.hospitalName;
      payload.location     = this.itemForm.value.location;
    } else if (role === 'SUPPLIER' || role === 'TECHNICIAN') {
      payload.fullName = this.itemForm.value.fullName;
    }

    this.successMessage = '';
    this.errorMessage   = '';

    this.httpService.registerUser(payload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.itemForm.reset();
        // FIX: Auto-navigate to login after short delay
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        // FIX: Show meaningful error from server if available
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}