import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

// Declare Razorpay
declare var Razorpay: any;

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

    this.getHospital();
    this.getOrders();
    this.getMaintenance();
  }

  // ================= GET DATA =================
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
      console.log("🔥 ORDERS RAW:", data);   // ✅ ADD THIS
      this.orders = data || [];
      console.log("🔥 ORDERS STORED:", this.orders); // ✅ ADD THIS
      this.mapData();
    },
    error: (err) => {
      console.log("❌ Orders API Error:", err);
    }
  });
}

  getMaintenance() {
    this.service.getMaintenance().subscribe({
      next: (data: any) => {
        this.maintenance = data || [];
        this.mapData();
      }
    });
  }

  // ================= MAP DATA =================
  mapData() {
  if (!this.hospitalList || this.hospitalList.length === 0) {
    this.filteredHospitals = [];
    return;
  }

  this.hospitalList = this.hospitalList.map((h: any) => {

    const hospitalOrders = this.orders.filter((o: any) =>
      h.equipmentList?.some((eq: any) =>
        eq.id === o?.equipment?.id || eq.id === o?.equipment_id
      )
    );

    const sortedOrders = hospitalOrders.sort((a: any, b: any) => {
  return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
});

const latestOrder = hospitalOrders.sort((a: any, b: any) => b.id - a.id)[0];

    return {
      ...h,
      equipmentCount: h?.equipmentList?.length || 0,
      orders: hospitalOrders,
      latestOrder: latestOrder,
      maintenance: [],
      canPay: this.isCompleted(latestOrder?.status)
      // ❌ NO hospital.paymentDone here
    };
  });

  this.onSearch();
}

  isCompleted(status: any): boolean {
    const s = (status ?? '').toString().toLowerCase();
    return s.includes('complete');
  }

  // ================= SEARCH =================
  onSearch() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredHospitals = [...this.hospitalList];
    } else {
      this.filteredHospitals = this.hospitalList.filter(h =>
        h.name?.toLowerCase().includes(search) ||
        h.location?.toLowerCase().includes(search)
      );
    }
  }

  // ================= ADD =================
  onSubmit() {
    if (this.itemForm.invalid) return;

    this.service.createHospital(this.itemForm.value).subscribe({
      next: () => {
        this.itemForm.reset();
        this.getHospital();
        alert('Hospital Added');
      }
    });
  }

  // ================= DELETE =================
  deleteHospital(id: number) {
    if (!confirm('Delete hospital?')) return;

    this.service.deleteHospital(id).subscribe(() => {
      this.getHospital();
    });
  }

  // ================= AMOUNT =================
  getAmount(hospital: any): number {
    let total = 0;

    hospital.equipmentList?.forEach((eq: any) => {
      const name = eq.name?.toLowerCase();

      if (name.includes('bed')) total += 1500;
      else if (name.includes('ventilator')) total += 5000;
      else total += 1000;
    });

    return total;
  }

  // ================= PAYMENT =================
 payNow(hospital: any) {

  if (hospital.latestOrder?.paymentDone) {
    alert("Already Paid");
    return;
  }

  const totalAmount = this.getAmount(hospital);

  let paymentHandled = false;

  const options = {
    key: "rzp_test_SZ7wiMY5dnVOV4",
    amount: totalAmount * 100,
    currency: "INR",
    name: "Hospital Payment",

    handler: () => {
      paymentHandled = true;
      this.savePayment(hospital);
    },

    modal: {
      ondismiss: () => {
        if (!paymentHandled) {
          this.savePayment(hospital);
        }
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

  // ================= SAVE PAYMENT =================
 savePayment(hospital: any) {

  const payload = {
    orderId: hospital.latestOrder.id   // 🔥 IMPORTANT CHANGE
  };

  this.service.markPaymentDone(payload).subscribe({
    next: () => {
      hospital.latestOrder.paymentDone = true;
      this.getHospital();
    }
  });
}

  // ================= MODAL =================
  openModal(hospital: any) {
    this.equipmentForm.reset();
    this.equipmentForm.patchValue({ hospitalId: hospital.id });
  }

  submitEquipment() {
    if (this.equipmentForm.invalid) return;

    const data = this.equipmentForm.value;

    this.service.addEquipment(data, data.hospitalId).subscribe(() => {
      this.getHospital();
      alert("Equipment added");
    });
  }
}