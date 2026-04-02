

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


  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  assignModel: any = {};
  itemForm!: FormGroup; 
  showMessage: any;
  responseMessage: any;
  maintenanceList: any = [];
  maintenanceObj: any = {};

  constructor(private fb: FormBuilder,private httpService:HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      completedDate: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      maintenanceId: ['', Validators.required]
    });
    this.getMaintenance();
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { invalidDate: true } : null;
  }


  getMaintenance(): void {
    this.httpService.getMaintenance().subscribe({
      next: (data) => {
        this.maintenanceList = data;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = "Failed to load maintenance records.";
      }
    });
  }

 
  viewDetails(details: any): void {
    this.maintenanceObj = details;
  }

  edit(maintenance: any): void {
    this.maintenanceObj = { ...maintenance }; 
    this.itemForm.patchValue({
      maintenanceId: maintenance.id,
      scheduledDate: maintenance.scheduledDate ? maintenance.scheduledDate.split('T')[0] : '',
      completedDate: maintenance.completedDate ? maintenance.completedDate.split('T')[0] : '',
      description: maintenance.description,
      status: maintenance.status
    });
  }

 
  update(): void {
    if (this.itemForm.valid) {
      console.log('clicked')
      const updatedData = this.itemForm.value;
      const maintenanceId = updatedData.maintenanceId;

      this.httpService.updateMaintenance(updatedData, maintenanceId).subscribe({
        next: (response) => {
          this.showMessage = true;
          this.responseMessage = "Maintenance updated successfully!";
          this.maintenanceObj = {}; 
          this.itemForm.reset();
          this.getMaintenance(); 
        },
        error: (err) => {
          this.showError = true;
          this.errorMessage = "Update failed. Please try again.";
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}




