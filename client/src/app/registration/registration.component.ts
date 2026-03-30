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

  constructor(
    private fb: FormBuilder, 
    private service: HttpService, 
    private router: Router
  ) {}

  ngOnInit(): void {
   
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.service.registerUser(this.itemForm.value).subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
