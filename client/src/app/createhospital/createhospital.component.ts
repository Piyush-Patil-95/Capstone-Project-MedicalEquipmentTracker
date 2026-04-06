import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit {

  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  // ── TABS ──────────────────────────────────
  activeTab: 'dashboard' | 'orders' | 'maintenance' | 'details' = 'dashboard';

  // ── DATA ──────────────────────────────────
  hospital: any = null;
  orders: any[] = [];
  maintenance: any[] = [];
  hospitalMaintenance: any[] = [];

  // Equipment that has complete/delivered order — shown in maintenance modal
  eligibleEquipment: any[] = [];

  // ── PROFILE PHOTO ─────────────────────────
  profilePhoto: string | null = null;
  private PHOTO_KEY = 'hospital_profile_photo';

  // ── ASSIGN EQUIPMENT MODAL ────────────────
  showAssignModal = false;
  submitting = false;
  assignForm!: FormGroup;
  showMessage = false;
  responseMessage = '';
  showError = false;
  errorMessage = '';

  // ── MAINTENANCE MODAL ─────────────────────
  showMaintenanceModal = false;
  maintSubmitting = false;
  maintenanceForm!: FormGroup;
  maintShowMessage = false;
  maintResponseMessage = '';
  maintShowError = false;
  maintErrorMessage = '';

  // ── DETAILS EDIT ──────────────────────────
  detailForm!: FormGroup;
  editMode = false;
  savingDetails = false;
  detailSaveSuccess = false;
  detailSaveError = false;
  detailSaveErrorMsg = '';

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      equipmentName:        ['', Validators.required],
      equipmentDescription: [''],
      quantity:             ['', [Validators.required, Validators.min(1)]],
      orderDate:            ['', Validators.required],
      status:               ['', Validators.required]
    });

    this.maintenanceForm = this.fb.group({
      equipmentId:   ['', Validators.required],
      scheduledDate: ['', Validators.required],
      completedDate: [''],
      status:        ['', Validators.required],
      description:   ['']
    });

    this.detailForm = this.fb.group({
      name:     ['', Validators.required],
      location: ['', Validators.required]
    });

    this.profilePhoto = localStorage.getItem(this.PHOTO_KEY) || null;
    this.getHospital();
    this.getMaintenance();
  }

  // ── DATA LOADING ──────────────────────────

  getHospital() {
  this.service.getMyHospital().subscribe({
    next: (data: any) => {
      this.hospital = Array.isArray(data) ? data[0] : data;
      if (this.hospital) {
        this.detailForm.patchValue({
          name: this.hospital.name,
          location: this.hospital.location
        });
        this.detailForm.disable();
        this.getOrders();
      }
    },
    error: (err: any) => console.error('Failed to load hospital:', err)
  });
}
      

  getOrders() {
    this.service.getorders().subscribe({
      next: (data: any) => {
        const allOrders: any[] = data || [];
        const equipmentIds = (this.hospital?.equipmentList || []).map((eq: any) => eq.id);

        this.orders = allOrders
          .filter((o: any) =>
            equipmentIds.includes(o?.equipment?.id) ||
            equipmentIds.includes(o?.equipment_id)
          )
          .sort((a: any, b: any) => b.id - a.id);

        // Build eligible equipment list for maintenance modal
        this.buildEligibleEquipment();
      },
      error: (err: any) => console.error('Failed to load orders:', err)
    });
  }

  getMaintenance() {
    this.service.getMaintenance().subscribe({
      next: (data: any) => {
        this.maintenance = data || [];
        this.filterHospitalMaintenance();
      },
      error: (err: any) => console.error('Failed to load maintenance:', err)
    });
  }

  filterHospitalMaintenance() {
    if (!this.hospital) return;
    const equipmentIds = (this.hospital?.equipmentList || []).map((eq: any) => eq.id);
    this.hospitalMaintenance = this.maintenance.filter((m: any) =>
      equipmentIds.includes(m?.equipment?.id) ||
      m?.hospital?.id === this.hospital?.id
    );
  }

  // ── ELIGIBLE EQUIPMENT ────────────────────
  // Only equipment whose latest order is 'complete' or 'delivered'

  buildEligibleEquipment() {
    if (!this.hospital?.equipmentList) return;

    this.eligibleEquipment = this.hospital.equipmentList.filter((eq: any) => {
      const status = this.getEquipmentOrderStatus(eq).toLowerCase();
      return status.includes('complete') || status.includes('deliver');
    });
  }

  // ── STAT HELPERS ──────────────────────────

  getOrderCountByStatus(status: string): number {
    return this.orders.filter((o: any) =>
      (o.status ?? '').toLowerCase() === status.toLowerCase()
    ).length;
  }

  getPaidCount(): number {
    return this.orders.filter((o: any) => o.paymentDone).length;
  }

  getEquipmentOrderStatus(eq: any): string {
    const order = this.orders
      .filter((o: any) => o?.equipment?.id === eq.id || o?.equipment_id === eq.id)
      .sort((a: any, b: any) => b.id - a.id)[0];
    return order?.status || 'No Order';
  }

  getStatusClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s.includes('complete'))  return 'complete';
    if (s.includes('deliver'))   return 'delivered';
    if (s.includes('initiat'))   return 'initiated';
    if (s.includes('pending'))   return 'pending';
    if (s.includes('cancel'))    return 'cancelled';
    if (s.includes('schedul'))   return 'scheduled';
    if (s.includes('progress'))  return 'initiated';
    return 'unknown';
  }

  // ── PROFILE PHOTO ─────────────────────────

  triggerPhotoUpload() {
    this.photoInput.nativeElement.click();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePhoto = e.target.result as string;
      localStorage.setItem(this.PHOTO_KEY, this.profilePhoto!);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removePhoto() {
    if (!confirm('Remove profile photo?')) return;
    this.profilePhoto = null;
    localStorage.removeItem(this.PHOTO_KEY);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() || '').join('');
  }

  // ── DETAILS EDIT ──────────────────────────

  enableEdit() {
    this.editMode = true;
    this.detailSaveSuccess = false;
    this.detailSaveError = false;
    this.detailForm.enable();
  }

  cancelEdit() {
    this.editMode = false;
    this.detailSaveSuccess = false;
    this.detailSaveError = false;
    this.detailForm.patchValue({ name: this.hospital.name, location: this.hospital.location });
    this.detailForm.disable();
  }

  saveDetails() {
    if (this.detailForm.invalid) { this.detailSaveError = true; this.detailSaveErrorMsg = 'Please fill all required fields.'; return; }
    this.savingDetails = true;
    this.detailSaveSuccess = false;
    this.detailSaveError = false;
    const payload = { name: this.detailForm.value.name, location: this.detailForm.value.location };
    this.service.updateHospital(this.hospital.id, payload).subscribe({
      next: (updated: any) => {
        this.savingDetails = false;
        this.editMode = false;
        this.detailSaveSuccess = true;
        this.hospital.name     = updated.name     || payload.name;
        this.hospital.location = updated.location || payload.location;
        this.detailForm.patchValue({ name: this.hospital.name, location: this.hospital.location });
        this.detailForm.disable();
        setTimeout(() => this.detailSaveSuccess = false, 3000);
      },
      error: (err: any) => {
        this.savingDetails = false;
        this.detailSaveError = true;
        this.detailSaveErrorMsg = 'Failed to update. Please try again.';
        console.error(err);
      }
    });
  }

  // ── ASSIGN EQUIPMENT MODAL ────────────────

  openAssignModal() {
    this.assignForm.reset();
    this.showMessage = false;
    this.showError = false;
    this.showAssignModal = true;
  }

  closeOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showAssignModal = false;
    }
  }

  submitAssignAndOrder() {
    if (this.assignForm.invalid) { this.showError = true; this.errorMessage = 'Please fill all required fields.'; return; }
    this.submitting = true;
    this.showError = false;
    this.showMessage = false;
    const formVal = this.assignForm.value;
    this.service.addEquipment({ name: formVal.equipmentName, description: formVal.equipmentDescription || '' }, this.hospital.id).subscribe({
      next: (newEquipment: any) => {
        this.service.orderEquipment({ quantity: formVal.quantity, orderDate: formVal.orderDate, status: formVal.status }, newEquipment.id).subscribe({
          next: () => {
            this.submitting = false;
            this.showMessage = true;
            this.responseMessage = 'Equipment assigned and order placed successfully!';
            this.assignForm.reset();
            this.getHospital();
            setTimeout(() => { this.showAssignModal = false; this.showMessage = false; }, 1500);
          },
          error: (err: any) => { this.submitting = false; this.showError = true; this.errorMessage = 'Equipment added but order failed.'; console.error(err); }
        });
      },
      error: (err: any) => { this.submitting = false; this.showError = true; this.errorMessage = 'Failed to add equipment.'; console.error(err); }
    });
  }

  // ── MAINTENANCE MODAL ─────────────────────

  openMaintenanceModal() {
    this.maintenanceForm.reset();
    this.maintShowMessage = false;
    this.maintShowError = false;
    this.showMaintenanceModal = true;
  }

  closeMaintenanceBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showMaintenanceModal = false;
    }
  }

  submitMaintenance() {
    if (this.maintenanceForm.invalid) {
      this.maintShowError = true;
      this.maintErrorMessage = 'Please fill all required fields.';
      return;
    }

    this.maintSubmitting = true;
    this.maintShowError = false;
    this.maintShowMessage = false;

    const formVal = this.maintenanceForm.value;

    const payload = {
      scheduledDate: formVal.scheduledDate,
      completedDate: formVal.completedDate || null,
      status:        formVal.status,
      description:   formVal.description || ''
    };

    this.service.scheduleMaintenance(payload, formVal.equipmentId).subscribe({
      next: () => {
        this.maintSubmitting = false;
        this.maintShowMessage = true;
        this.maintResponseMessage = 'Maintenance scheduled successfully!';
        this.maintenanceForm.reset();
        this.getMaintenance();
        setTimeout(() => { this.showMaintenanceModal = false; this.maintShowMessage = false; }, 1500);
      },
      error: (err: any) => {
        this.maintSubmitting = false;
        this.maintShowError = true;
        this.maintErrorMessage = 'Failed to schedule maintenance. Please try again.';
        console.error(err);
      }
    });
  }

  // ── PAYMENT — logic unchanged ─────────────

  getAmountForOrder(order: any): number {
    const name = (order?.equipment?.name ?? '').toLowerCase();
    if (name.includes('bed'))        return 1500;
    if (name.includes('ventilator')) return 5000;
    return 1000;
  }

  payNow(order: any) {
    if (order.paymentDone) { alert('Already Paid'); return; }
    const totalAmount = this.getAmountForOrder(order);
    let paymentHandled = false;
    const options = {
      key: 'rzp_test_SZ7wiMY5dnVOV4',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Hospital Payment',
      handler: () => { paymentHandled = true; this.savePayment(order); },
      modal: { ondismiss: () => { if (!paymentHandled) this.savePayment(order); } }
    };
    new Razorpay(options).open();
  }

  savePayment(order: any) {
    this.service.markPaymentDone({ orderId: order.id }).subscribe({
      next: () => { order.paymentDone = true; this.getHospital(); },
      error: (err: any) => console.error('Payment save failed:', err)
    });
  }
}