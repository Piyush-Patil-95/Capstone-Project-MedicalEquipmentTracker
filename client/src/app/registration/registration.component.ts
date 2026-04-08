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
  otpForm!: FormGroup;
  hidePassword: boolean = true;
  showPopup = false;

  successMessage: string = '';
  errorMessage: string = '';

  // ✅ OTP flow states
  showOtpBox: boolean = false;      // Show OTP input box
  otpSent: boolean = false;         // OTP was sent
  otpVerified: boolean = false;     // OTP verified
  otpLoading: boolean = false;      // Loading state
  otpError: string = '';            // OTP error msg
  otpSuccess: string = '';          // OTP success msg
  resendTimer: number = 0;          // Countdown timer
  timerInterval: any;

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
      password:     ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$')]],
      role:         ['', Validators.required],
      hospitalName: [''],
      location:     [''],
      fullName:     ['']
    });

    // ✅ OTP form
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.itemForm.get('role')?.valueChanges.subscribe(role => {
      this.clearConditionalValidators();
      if (role === 'HOSPITAL') {
        this.itemForm.get('hospitalName')?.setValidators([Validators.required]);
        this.itemForm.get('location')?.setValidators([Validators.required]);
      } else if (role === 'SUPPLIER' || role === 'TECHNICIAN') {
        this.itemForm.get('fullName')?.setValidators([Validators.required]);
      }
      ['hospitalName', 'location', 'fullName'].forEach(field =>
        this.itemForm.get(field)?.updateValueAndValidity()
      );
    });
  }

  clearConditionalValidators(): void {
    ['hospitalName', 'location', 'fullName'].forEach(field => {
      const control = this.itemForm.get(field);
      control?.clearValidators();
      control?.setValue('');
      control?.updateValueAndValidity();
    });
  }

  // ✅ Step 1: Send OTP
  sendOtp(): void {
    const email = this.itemForm.get('email')?.value;

    if (!email || this.itemForm.get('email')?.invalid) {
      this.otpError = 'Please enter a valid email first!';
      return;
    }

    this.otpLoading = true;
    this.otpError = '';
    this.otpSuccess = '';

    this.httpService.sendOtp(email).subscribe({
      next: () => {
        this.otpLoading = false;
        this.otpSent = true;
        this.showOtpBox = true;
        this.otpSuccess = `OTP sent to ${email}`;
        this.startResendTimer();
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = 'Failed to send OTP. Try again!';
      }
    });
  }

  // ✅ Step 2: Verify OTP
  verifyOtp(): void {
    const email = this.itemForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;

    if (!otp || otp.length !== 6) {
      this.otpError = 'Please enter the 6-digit OTP!';
      return;
    }

    this.otpLoading = true;
    this.otpError = '';

    this.httpService.verifyOtp(email, otp).subscribe({
      next: () => {
        this.otpLoading = false;
        this.otpVerified = true;
        this.showOtpBox = false;
        this.otpSuccess = '✅ Email verified successfully!';
        clearInterval(this.timerInterval);
      },
      error: () => {
        this.otpLoading = false;
        this.otpError = '❌ Invalid or expired OTP!';
      }
    });
  }

  // ✅ Resend Timer (30 seconds)
  startResendTimer(): void {
    this.resendTimer = 30;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  // ✅ Step 3: Register (only if OTP verified)
  onRegister(): void {
    this.itemForm.markAllAsTouched();
    if (this.itemForm.invalid) return;

    if (!this.otpVerified) {
      this.errorMessage = '⚠️ Please verify your email with OTP first!';
      return;
    }

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
        this.itemForm.reset();
        this.showPopup = true;
        setTimeout(() => {this.showPopup = false; 
          this.router.navigate(['/login']);},2500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}