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
  ngOnInit(): void {
    
  }
 ///todo: complete missing code
itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  onLogin() {
    if (this.itemForm.valid) {
      this.formModel = this.itemForm.value;
      console.log('Logging in with:', this.formModel);
      // Logic for authentication service goes here
    } else {
      this.showError = true;
      this.errorMessage = 'Please provide valid credentials.';
    }
  }

  registration() {
    this.router.navigate(['/registration']);
  }
}


