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
  forgotForm!: FormGroup;

  captchaQuestion: string = '';
  captchaId: string = '';

  showError: boolean = false;
  errorMessage: any;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showNewPassword: boolean = false;

  // ✅ Forgot Password States
  showForgotModal: boolean = false;
  forgotStep: number = 1;       // 1=email, 2=otp, 3=newpassword
  forgotLoading: boolean = false;
  forgotError: string = '';
  forgotSuccess: string = '';
  forgotEmail: string = '';
  forgotOtp: string = '';
  resendTimer: number = 0;
  timerInterval: any;

  particles: number[] = Array(50).fill(0);

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username:      ['', Validators.required],
      password:      ['', Validators.required],
      captchaAnswer: ['', Validators.required]
    });

    this.forgotForm = this.fb.group({
      email:       ['', [Validators.required, Validators.email]],
      otp:         ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8),
                         Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]]
    });

    this.loadCaptcha();
  }

  loadCaptcha() {
    this.httpService.getCaptcha().subscribe({
      next: (res: any) => {
        this.captchaQuestion = res.question;
        this.captchaId = res.captchaId;
      },
      error: () => {
        this.errorMessage = 'Unable to load captcha';
      }
    });
  }

  onLogin() {
    if (this.itemForm.invalid) return;

    const loginPayload = {
      username:      this.itemForm.value.username,
      password:      this.itemForm.value.password,
      captchaId:     this.captchaId,
      captchaAnswer: this.itemForm.value.captchaAnswer
    };

    this.httpService.Login(loginPayload).subscribe({
      next: (response: any) => {
        if (response.token) this.authService.saveToken(response.token);
        if (response.role) {
          this.authService.SetRole(response.role);
          if (response.role === 'TECHNICIAN') this.router.navigate(['/maintenance']);
          if (response.role === 'HOSPITAL')   this.router.navigate(['/createhospital']);
          if (response.role === 'SUPPLIER')   this.router.navigate(['/orders']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid credentials or captcha';
        this.showError = true;
        this.loadCaptcha();
        this.itemForm.get('captchaAnswer')?.reset();
      }
    });
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleNewPassword(): void { this.showNewPassword = !this.showNewPassword; }
  registration() { this.router.navigate(['/registration']); }

  // ============ FORGOT PASSWORD ============

  // ✅ Open Modal
  openForgotModal(): void {
    this.showForgotModal = true;
    this.forgotStep = 1;
    this.forgotError = '';
    this.forgotSuccess = '';
    this.forgotEmail = '';
    this.forgotOtp = '';
    this.forgotForm.reset();
  }

  // ✅ Close Modal
  closeForgotModal(): void {
    this.showForgotModal = false;
    this.forgotStep = 1;
    this.forgotError = '';
    this.forgotSuccess = '';
    clearInterval(this.timerInterval);
  }

  // ✅ Step 1: Send OTP
  sendForgotOtp(): void {
    const email = this.forgotForm.get('email')?.value;
    if (!email || this.forgotForm.get('email')?.invalid) {
      this.forgotError = 'Please enter a valid email!';
      return;
    }

    this.forgotLoading = true;
    this.forgotError = '';
    this.forgotEmail = email;

    this.httpService.forgotPasswordSendOtp(email).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 2;
        this.forgotSuccess = `OTP sent to ${email}`;
        this.startResendTimer();
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = 'Email not found or failed to send OTP!';
      }
    });
  }

  // ✅ Step 2: Verify OTP
  verifyForgotOtp(): void {
    const otp = this.forgotForm.get('otp')?.value;
    if (!otp || otp.length < 6) {
      this.forgotError = 'Enter the 6-digit OTP!';
      return;
    }

    this.forgotLoading = true;
    this.forgotError = '';
    this.forgotOtp = otp;

    this.httpService.forgotPasswordVerifyOtp(this.forgotEmail, otp).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 3;
        this.forgotSuccess = 'OTP verified! Set your new password.';
        clearInterval(this.timerInterval);
      },
      error: () => {
        this.forgotLoading = false;
        this.forgotError = 'Invalid or expired OTP!';
      }
    });
  }

  // ✅ Step 3: Reset Password
  resetPassword(): void {
    const newPassword = this.forgotForm.get('newPassword')?.value;
    if (!newPassword || this.forgotForm.get('newPassword')?.invalid) {
      this.forgotError = 'Please enter a valid password!';
      return;
    }

    this.forgotLoading = true;
    this.forgotError = '';

    this.httpService.resetPassword(
      this.forgotEmail, this.forgotOtp, newPassword
    ).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 4; // Success step
        this.forgotSuccess = 'Password reset successfully!';
      },
      error: () => {
        this.forgotLoading = false;
        this.forgotError = 'Failed to reset password. Try again!';
      }
    });
  }

  // ✅ Resend Timer
  startResendTimer(): void {
    this.resendTimer = 30;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(this.timerInterval);
    }, 1000);
  }

  resendForgotOtp(): void {
    this.forgotForm.get('otp')?.reset();
    this.forgotError = '';
    this.sendForgotOtp();
  }
}