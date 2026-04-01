import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-requestequipment',
  templateUrl: './requestequipment.component.html',
  styleUrls: ['./requestequipment.component.scss']
})
export class RequestequipmentComponent implements OnInit {

  itemForm!: FormGroup;

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
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      hospitalId: ['', Validators.required],
      equipmentId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      orderDate: ['', Validators.required],
      status: ['', Validators.required]
    }, { validators: this.dateValidator });

    this.getHospital();
  }

  // ================================================
  // DATE VALIDATOR (Optional in screenshot)
  // ================================================
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const orderDate = control.get('orderDate')?.value;
    if (!orderDate) return null;

    // prevent selecting a past date
    const today = new Date().toISOString().split('T')[0];
    if (orderDate < today) {
      return { invalidDate: true };
    }
    return null;
  }

  // ================================================
  // GET ALL HOSPITALS
  // ================================================
  getHospital() {
    this.http.getHospital().subscribe({
      next: (res: any) => {
        this.hospitalList = res;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load hospitals.';
      }
    });
  }

  // ================================================
  // LOAD EQUIPMENT FOR SELECTED HOSPITAL
  // ================================================
  onHospitalSelect(event: any) {
    const id = event.target.value;

    if (!id) {
      this.equipmentList = [];
      return;
    }

    this.http.getEquipmentById(id).subscribe({
      next: (res: any) => {
        this.equipmentList = res;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load equipment.';
      }
    });
  }

  // ================================================
  // SUBMIT ORDER
  // ================================================
  onSubmit() {
    if (this.itemForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const formValue = this.itemForm.value;

    const payload = {
      quantity: formValue.quantity,
      orderDate: formValue.orderDate,
      status: formValue.status
    };

    this.http.orderEquipment(payload,formValue.equipmentId ).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Save Successfully';
        this.itemForm.reset();
        this.router.navigate(['/createhospital'])
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to submit equipment order.';
      }
    });
  }
}