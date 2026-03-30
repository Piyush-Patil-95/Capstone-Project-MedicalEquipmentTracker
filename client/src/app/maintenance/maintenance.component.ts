import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})

export class MaintenanceComponent implements OnInit {
  itemForm!: FormGroup; 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      completedDate: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      maintenanceId: ['', Validators.required]
    });
  }
}


