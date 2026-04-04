

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
  status: ['', Validators.required]
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
 deleteMaintenance(id: number) {
  if (!confirm('Are you sure you want to delete this maintenance?')) return;

  this.httpService.deleteMaintenance(id).subscribe({
    next: () => {
      // remove from UI instantly
      this.maintenanceList = this.maintenanceList.filter((m: any) => m.id !== id);
      alert('Deleted successfully');
    },
    error: (err: any) => {
      console.error(err);
      alert('Delete failed');
    }
  });
}
 
  update(): void {
  if (this.itemForm.valid) {
    const updatedData = this.itemForm.value;

    this.httpService.updateMaintenance(updatedData, this.maintenanceObj.id).subscribe({
      next: () => {
        alert("Updated Successfully");
        this.maintenanceObj = {};
        this.itemForm.reset();
        this.getMaintenance();
      },
      error: (err) => {
        console.error(err);
        alert("Update failed");
      }
    });
  }
}
}




