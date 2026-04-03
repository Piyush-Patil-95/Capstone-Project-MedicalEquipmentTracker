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
  searchText: string = ''; // Changed to lowercase string
  filteredHospitals: any[] = []

  hospitalList: any[] = [];

  // ✅ OLD FEATURES BACK
  orders: any[] = [];
  maintenance: any[] = [];

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
      hospitalId: ['', Validators.required]
    });

    // ✅ Load everything
    this.getHospital();
    this.getOrders();
    this.getMaintenance();
  }

  // ================================================
  // GET ALL HOSPITALS
  // ================================================
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

  getOrders() {
    this.service.getorders().subscribe({
      next: (data: any) => {
        this.orders = data || [];
        this.mapData();
      },
      error: () => {}
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

  // ================================================
  // MAP DATA & INITIALIZE FILTERED LIST
  // ================================================
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

    // ✅ FIX: Ensure the view updates whenever data is mapped/loaded
    this.onSearch();
  }

  // ================================================
  // SEARCH LOGIC (FIXED)
  // ================================================
  onSearch() {
    const search = this.searchText.toLowerCase().trim();
 
    if (!search) {
      // ✅ FIX: If search is empty, show everything
      this.filteredHospitals = [...this.hospitalList];
    } else {
      this.filteredHospitals = this.hospitalList.filter(h =>
        (h.name && h.name.toLowerCase().includes(search)) ||
        (h.location && h.location.toLowerCase().includes(search))
      );
    }
  }

  // ================================================
  // ADD HOSPITAL
  // ================================================
  onSubmit() {
    this.showError = false;
    this.errorMessage = null;

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = "Please find all required hospital fields";
      return;
    }

    this.service.createHospital(this.itemForm.value).subscribe({
      next: () => {
        this.itemForm.reset();
        this.showError = false;
        alert('Hospital Added !');
        this.getHospital(); // Re-fetches and triggers mapData -> onSearch
      },
      error: () => {
        this.showError = true;
        this.errorMessage = "Failed to add hospital";
      }
    });
  }

  // ================================================
  // DELETE HOSPITAL
  // ================================================
  deleteHospital(id: number) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    this.service.deleteHospital(id).subscribe({
      next: () => {
        this.hospitalList = this.hospitalList.filter((h: any) => h.id !== id);
        this.onSearch(); // ✅ FIX: Update the display immediately
      },
      error: () => {
        this.hospitalList = this.hospitalList.filter((h: any) => h.id !== id);
        this.onSearch(); // ✅ FIX: Update the display immediately
      }
    });
  }

  openModal(hospital: any) {
    this.showMessage = false;
    this.responseMessage = null;
    this.showError = false;
    this.errorMessage = null;
    this.equipmentForm.reset();
    this.equipmentForm.patchValue({ hospitalId: hospital.id });
  }

  submitEquipment() {
    this.showMessage = false;
    this.showError = false;

    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = "Please find all required equipment fields";
      return;
    }

    const equipmentData = this.equipmentForm.value;
    const hospitalId = equipmentData.hospitalId;

    this.service.addEquipment(equipmentData, hospitalId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = "Equipment added successfully";
        this.getHospital(); // Refreshes counts and list
        setTimeout(() => {
          this.equipmentForm.reset();
          this.equipmentForm.patchValue({ hospitalId: hospitalId });
        }, 1200);
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = "Failed to add equipment";
      }
    });
  }
}
