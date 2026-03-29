import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-schedule-maintenance',
  templateUrl: './schedule-maintenance.component.html',
  styleUrls: ['./schedule-maintenance.component.scss']
})
export class ScheduleMaintenanceComponent {
  //todo: complete missing code
  itemForm !: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  showMessage: boolean = false;
  responseMessage: any;
  hospitalList: any[] = [];
  equipmentList: any[] = [];

  assignModel: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private auth: AuthService) {

  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({

      hospitalId: ['', Validators.required],
      equipmentId: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      completedDate: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    }, {
      validators: this.dateValidator



    });
    this.getHospital();
  }


  dateValidator(control: AbstractControl): ValidationErrors | null {
    const scheduled = control.get('scheduledDate')?.value;
    const completed = control.get('completedDate')?.value;

    if (scheduled && completed && scheduled > completed) {
      return { dateInvalid: true };
    }
    return null;
  }


  getHospital() {
    this.http.getHospital().subscribe(
      (res: any) => {
        this.hospitalList = res;
      },
      (err) => {
        this.showError = true;
        this.errorMessage = "Failed to load hospitals.";
      }
    );
  }



  onHospitalSelect(event: any) {
    const id = event.target.value;

    if (!id) {
      this.equipmentList = [];
      return;
    }

    this.http.getEquipmentById(id).subscribe(
      (res: any) => {
        this.equipmentList = res;
      },

      (err) => {
        this.showError = true;
        this.errorMessage = "Unable to load equipment for selected hospital.";
      }
    );
  }


  onSubmit() {
    if (this.itemForm.invalid) {
      this.showError = true;
      this.errorMessage = "Please fill all required fields correctly.";
      return;
    }

    const formValue = this.itemForm.value;
    const equipmentId = formValue.equipmentId;



    const payload = {
      scheduledDate: formValue.scheduledDate,
      completedDate: formValue.completedDate,
      description: formValue.description,
      status: formValue.status
    };


    this.http.scheduleMaintenance(equipmentId).subscribe(
      (res: any) => {
        this.showMessage = true;
        this.responseMessage = "Saved Successfully";
        this.itemForm.reset();
      },
      (err) => {
        this.showError = true;
        this.errorMessage = "Error scheduling maintenance.";
      }
    );
  }

}

