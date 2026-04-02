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

  formModel: any = {};
  // captcha fields
  captchaQuestion: string = '';
  captchaId: string = '';

  showError: boolean = false;

  errorMessage: any;

  isLoading: boolean = false;

  showPassword: boolean = false;

  // For particles

  particles: number[] = Array(50).fill(0);
 
  constructor(

    private httpService: HttpService,

    private fb: FormBuilder,

    private router: Router,

    private authService: AuthService

  ) {}
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],

      // ✅ CAPTCHA form control
      captchaAnswer: ['', Validators.required]
    });

    // ✅ load captcha on page load
    this.loadCaptcha();
  }

  // ✅ CAPTCHA: generate captcha
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
      username: this.itemForm.value.username,
      password: this.itemForm.value.password,

      // ✅ CAPTCHA payload
      captchaId: this.captchaId,
      captchaAnswer: this.itemForm.value.captchaAnswer
    };

    this.httpService.Login(loginPayload).subscribe({
      next: (response: any) => {

        // ✅ Save JWT
        if (response.token) {
          this.authService.saveToken(response.token);
        }

        // ✅ Save role & routing
        if (response.role) {
          this.authService.SetRole(response.role);

          if (response.role === 'TECHNICIAN') {
            this.router.navigate(['/maintenance']);
          }
          if (response.role === 'HOSPITAL') {
            this.router.navigate(['/createhospital']);
          }
          if (response.role === 'SUPPLIER') {
            this.router.navigate(['/orders']);
          }
        }
      },
      error: () => {
        this.errorMessage = 'Invalid credentials or captcha';
        this.showError = true;

        // 🔄 Reload captcha on failure
        this.loadCaptcha();
        this.itemForm.get('captchaAnswer')?.reset();
      }
    });
  }
  
  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }
 
  
 
  registration() {

    this.router.navigate(['/registration']);

  }

}
 