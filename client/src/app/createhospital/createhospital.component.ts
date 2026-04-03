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
export class CreatehospitalComponent implements OnInit {

  itemForm!: FormGroup;
  equipmentForm!: FormGroup;

  showError: boolean = false;
  errorMessage: any = null;

  showMessage: boolean = false;
  responseMessage: any = null;

  searchText: string = '';
  filteredHospitals: any[] = [];

  hospitalList: any[] = [];
  orders: any[] = [];
  maintenance: any[] = [];

  supplierList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      hospitalId: ['', Validators.required],
      supplierId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.getHospital();
    this.getOrders();
    this.getMaintenance();
    this.getSuppliers();
  }

  getHospital() {
    this.service.getHospital().subscribe({
      next: (data: any) => {
        this.hospitalList = data || [];
        this.mapData();
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load hospitals.';
      }
    });
  }

  // ✅ FIX: Get ALL orders (not supplier-specific)
  getOrders() {
    this.service.getAllOrders().subscribe({
      next: (data: any) => {
        this.orders = data || [];
        this.mapData();
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  getMaintenance() {
    this.service.getMaintenance().subscribe({
      next: (data: any) => {
        this.maintenance = data || [];
        this.mapData();
      },
      error: () => {}
    });
  }

  getSuppliers() {
    this.service.getAllUsers().subscribe({
      next: (data: any) => {
        this.supplierList = (data || []).filter(
          (user: any) =>
            user.role &&
            user.role.toLowerCase().includes('supplier')
        );
      },
      error: () => {
        this.supplierList = [];
      }
    });
  }

  mapData() {
    if (!this.hospitalList || this.hospitalList.length === 0) {
      this.filteredHospitals = [];
      return;
    }

    this.hospitalList = this.hospitalList.map((h: any) => {
      const hospitalOrders = this.orders.filter(
        (o: any) => o?.equipment?.hospital?.id === h.id
      );
      const hospitalMaintenance = this.maintenance.filter(
        (m: any) => m?.hospital?.id === h.id
      );

      return {
        ...h,
        equipmentCount: h?.equipmentList?.length || 0,
        orders: hospitalOrders,
        maintenance: hospitalMaintenance
      };
    });

    this.onSearch();
  }

  onSearch() {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.filteredHospitals = [...this.hospitalList];
    } else {
      this.filteredHospitals = this.hospitalList.filter(h =>
        (h.name && h.name.toLowerCase().includes(search)) ||
        (h.location && h.location.toLowerCase().includes(search))
      );
    }
  }

  onSubmit() {
    this.showError = false;
    this.errorMessage = null;

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill all required hospital fields';
      return;
    }

    this.service.createHospital(this.itemForm.value).subscribe({
      next: () => {
        this.itemForm.reset();
        alert('Hospital Added!');
        this.getHospital();
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to add hospital';
      }
    });
  }

  deleteHospital(id: number) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    this.service.deleteHospital(id).subscribe({
      next: () => {
        this.hospitalList = this.hospitalList.filter((h: any) => h.id !== id);
        this.onSearch();
      },
      error: () => {
        this.hospitalList = this.hospitalList.filter((h: any) => h.id !== id);
        this.onSearch();
      }
    });
  }

  openModal(hospital: any) {
    this.showMessage = false;
    this.responseMessage = null;
    this.showError = false;
    this.errorMessage = null;
    this.equipmentForm.reset();
    this.equipmentForm.patchValue({ 
      hospitalId: hospital.id,
      quantity: 1  // ✅ Reset quantity to default
    });
  }

  // ✅ FIXED: Now includes quantity parameter
  submitEquipment() {
    this.showMessage = false;
    this.showError = false;

    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill all required equipment fields';
      return;
    }

    const equipmentData = this.equipmentForm.value;
    const hospitalId = equipmentData.hospitalId;
    const supplierId = equipmentData.supplierId;
    const quantity = equipmentData.quantity || 1;  // ✅ GET QUANTITY

    const body = {
      name: equipmentData.name,
      description: equipmentData.description
    };

    // ✅ PASS QUANTITY
    this.service.addEquipment(body, hospitalId, supplierId, quantity).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Equipment assigned and order created successfully!';
        this.getHospital();
        this.getOrders();  // ✅ Refresh orders
        setTimeout(() => {
          this.equipmentForm.reset();
          this.equipmentForm.patchValue({ 
            hospitalId: hospitalId,
            quantity: 1
          });
          this.showMessage = false;
        }, 1500);
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to assign equipment';
      }
    });
  }
}
