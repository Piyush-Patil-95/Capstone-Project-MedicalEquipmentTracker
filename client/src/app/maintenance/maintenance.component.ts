import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  activeTab: 'dashboard' | 'maintenance' = 'dashboard';

  // ── DATA ──────────────────────────────────
  maintenanceList: any[] = [];
  filteredMaintenance: any[] = [];
  filterStatus: string = '';

  // Hospital breakdown for dashboard
  hospitalBreakdown: { name: string; location: string; count: number }[] = [];

  // ── EDIT MODAL ────────────────────────────
  showEditModal = false;
  editSubmitting = false;
  selectedMaintenance: any = null;
  editForm!: FormGroup;
  editShowMessage = false;
  editResponseMessage = '';
  editShowError = false;
  editErrorMessage = '';

  // ── TOAST ─────────────────────────────────
  showToast = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      completedDate: [''],
      status: ['', Validators.required],
      description: ['']
    });

    this.getMaintenance();
  }

  // ── DATA LOADING ──────────────────────────

  getMaintenance() {
    this.httpService.getMaintenance().subscribe({
      next: (data: any) => {
        this.maintenanceList = (Array.isArray(data) ? data : []).sort(
          (a: any, b: any) => b.id - a.id
        );
        this.applyFilter();
        this.buildHospitalBreakdown();
      },
      error: (err: any) => console.error('Failed to load maintenance:', err)
    });
  }

  // ── FILTER ────────────────────────────────

  applyFilter(): void {
    if (!this.filterStatus) {
      this.filteredMaintenance = [...this.maintenanceList];
    } else {
      this.filteredMaintenance = this.maintenanceList.filter((m: any) =>
        (m.status ?? '').toLowerCase() === this.filterStatus.toLowerCase()
      );
    }
  }

  setFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  // ── STATS ─────────────────────────────────

  getMaintenanceCountByStatus(status: string): number {
    return this.maintenanceList.filter((m: any) =>
      (m.status ?? '').toLowerCase() === status.toLowerCase()
    ).length;
  }

  getStatusClass(status: string): string {
    const s = (status ?? '').toLowerCase().trim();
    if (s === 'complete') return 'complete';
    if (s === 'in progress') return 'in-progress';
    if (s === 'pending') return 'pending';
    if (s === 'initiated') return 'initiated';
    if (s === 'scheduled') return 'scheduled';
    return 'unknown';
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() || '')
      .join('');
  }

  // ── HOSPITAL BREAKDOWN ────────────────────

  buildHospitalBreakdown(): void {
    const map = new Map<string, { name: string; location: string; count: number }>();

    this.maintenanceList.forEach((m: any) => {
      const hName = m.hospital?.name || m.equipment?.hospital?.name || 'Unknown';
      const hLoc  = m.hospital?.location || m.equipment?.hospital?.location || '';
      const key   = hName;

      if (map.has(key)) {
        map.get(key)!.count++;
      } else {
        map.set(key, { name: hName, location: hLoc, count: 1 });
      }
    });

    this.hospitalBreakdown = Array.from(map.values())
      .sort((a, b) => b.count - a.count);
  }

  // ── EDIT MODAL ────────────────────────────

  openEditModal(item: any): void {
    this.selectedMaintenance = item;
    this.editShowMessage = false;
    this.editShowError = false;
    this.editErrorMessage = '';
    this.editResponseMessage = '';

    const toDateString = (val: any): string => {
      if (!val) return '';
      const s = val.toString();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      return s.split('T')[0];
    };

    this.editForm.patchValue({
      scheduledDate: toDateString(item.scheduledDate),
      completedDate: toDateString(item.completedDate),
      status:        item.status || '',
      description:   item.description || ''
    });

    this.showEditModal = true;
  }

  closeEditBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showEditModal = false;
    }
  }

  submitUpdate(): void {
    this.editForm.markAllAsTouched();

    if (this.editForm.invalid) {
      this.editShowError = true;
      this.editErrorMessage = 'Please fill all required fields.';
      return;
    }

    this.editSubmitting = true;
    this.editShowError   = false;
    this.editShowMessage = false;

    const payload = {
      scheduledDate: this.editForm.value.scheduledDate,
      completedDate: this.editForm.value.completedDate || null,
      status:        this.editForm.value.status,
      description:   this.editForm.value.description || ''
    };

    this.httpService.updateMaintenance(payload, this.selectedMaintenance.id).subscribe({
      next: () => {
        this.editSubmitting   = false;
        this.editShowMessage  = true;
        this.editResponseMessage = 'Updated successfully!';

        this.getMaintenance();

        setTimeout(() => {
          this.showEditModal   = false;
          this.editShowMessage = false;
        }, 1200);
      },
      error: (err: any) => {
        this.editSubmitting  = false;
        this.editShowError   = true;
        this.editErrorMessage = err?.error?.message || 'Update failed. Please try again.';
        console.error('Update error:', err);
      }
    });
  }

  // ── DELETE ────────────────────────────────

  deleteMaintenance(id: number): void {
    if (!confirm('Delete this maintenance record?')) return;

    this.httpService.deleteMaintenance(id).subscribe({
      next: () => {
        this.maintenanceList = this.maintenanceList.filter((m: any) => m.id !== id);
        this.applyFilter();
        this.buildHospitalBreakdown();
        this.showToastMsg('Maintenance record deleted.');
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
        alert('Delete failed. Please try again.');
      }
    });
  }

  // ── PDF DOWNLOAD ──────────────────────────

 downloadPdf(item: any): void {
  const id = item.id;
  // ✅ Use the correct maintenance PDF method
  this.httpService.downloadMaintenancePdf(id).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.showToastMsg('PDF downloaded successfully!');
    },
    error: (err: any) => {
      console.error('PDF download failed:', err);
      alert('Could not download PDF. Please try again.');
    }
  });
}

  // ── TOAST ─────────────────────────────────

  showToastMsg(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  debugData() {
    console.log('maintenanceList:', this.maintenanceList);
    console.log('filteredMaintenance:', this.filteredMaintenance);
    this.httpService.getMaintenance().subscribe({
      next: (data: any) => console.log('RAW API RESPONSE:', data),
      error: (err: any) => console.log('API ERROR:', err)
    });
  }

  signOut() {
    this.router.navigate(['/dashboard']);
  }
}