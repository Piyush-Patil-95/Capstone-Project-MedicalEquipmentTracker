import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { response } from 'express';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  itemForm!: FormGroup;
  otpForm!: FormGroup;

  otpSent: boolean = false;    
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

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  // ============================================================
  // STEP 1 → REGISTER API CALL
  // ============================================================
  // onRegister(): void {
  //   console.log("REGistered",response)
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   if (this.itemForm.invalid) {
  //     this.errorMessage = "Please fill all fields correctly.";
  //     return;
  //   }

  //   this.httpService.registerUser(this.itemForm.value).subscribe({
  //     next: (res) => {
  //       // FIX for [object Object]
  //       this.successMessage = res?.message || res;
  //       this.otpSent = true;   // Show OTP input
  //     },
  //     error: (err) => {
  //       this.errorMessage = err?.error?.message || err?.error || "Registration failed";
  //     }
  //   });
  // }
  onRegister(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (this.itemForm.invalid) {
    this.errorMessage = "Please fill all fields correctly.";
    return;
  }

  this.httpService.registerUser(this.itemForm.value).subscribe({
    next: (res) => {
      console.log("REGISTER RESPONSE = ", res);

      this.successMessage =
        res?.message ||
        res?.text ||
        res?.body ||
        res;

      this.otpSent = true;
    },
    error: (err) => {
      console.log("REGISTER ERROR = ", err);

      this.errorMessage =
        err?.error?.message ||
        err?.error?.text ||
        err?.error?.body ||
        err?.error ||
        "Registration failed";
    }
  });
}

  // ============================================================
  // STEP 2 → OTP VERIFY API CALL
  // ============================================================
  verifyOtp(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.itemForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;

    if (!otp) {
      this.errorMessage = "Enter OTP";
      return;
    }
   const body={email:email,otp:otp};
    this.httpService.verifyEmailOtp(body).subscribe({
      next: (res) => {
        this.successMessage = res?.message || res;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.error || "Invalid OTP";
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}