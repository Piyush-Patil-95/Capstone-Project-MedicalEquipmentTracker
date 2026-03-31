import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
// ... imports stay the same

export class CreatehospitalComponent implements OnInit {
  itemForm!: FormGroup;
  equipmentForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = []; 
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;

  constructor(
    private fb: FormBuilder, 
    private service: HttpService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      hospitalId: ['', Validators.required]
    });

    this.getHospital();
  }

  getHospital() {
    this.service.getHospital().subscribe(data => {
      this.hospitalList = data;
    });
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = "Please find all required hospital fields";
      return;
    }
    
    this.service.createHospital(this.itemForm.value).subscribe(() => {
      this.getHospital()
      this.itemForm.reset();
      this.showError = false
      alert('Hospital Added !')
      this.router.navigate(['/createhospital']);
    });
  }

  addEquipment(value: any) {
    const hospitalId = value.hospitalId; 
    this.service.addEquipment(value, hospitalId).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  submitEquipment() {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = "Please find all required equipment fields";
      return;
    }

    const equipmentData = this.equipmentForm.value;
    const hospitalId = equipmentData.hospitalId;

    this.service.addEquipment(equipmentData, hospitalId).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
