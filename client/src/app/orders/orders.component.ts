import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  currentView: string = 'dashboard';

  // ── State ──────────────────────────────────────
  showError:       boolean = false;
  errorMessage:    string  = '';
  showMessage:     boolean = false;
  responseMessage: string  = '';

  orderList:     any[] = [];
  deletedOrders: any[] = [];

  orderObj:      any = {};
  statusModel:   any = { newStatus: null };
  pendingStatus: string = '';

  // ── Tracking steps ────────────────────────────
  trackingSteps:  string[] = ['Initiated', 'Complete', 'Delivered'];
  statusFlow:     string[] = ['Initiated', 'Complete', 'Delivered'];
  cardTrackSteps: string[] = ['Initiated', 'Complete', 'Delivered'];

  // ── Status filter ─────────────────────────────
  showFilterPanel: boolean = false;
  selectedStatus:  string  = 'All';
  statusOptions:   string[] = ['All', 'Initiated', 'Complete', 'Delivered'];

  // ── Payment filter ────────────────────────────
  showPaymentPanel: boolean = false;
  selectedPayment:  string  = 'All Payments';
  paymentOptions:   string[] = ['All Payments', 'Paid', 'Unpaid'];

  // ── Bulk select ───────────────────────────────
  selectedMap:          { [id: number]: boolean } = {};
  showDeleteConfirm:    boolean = false;
  showDeletedPanel:     boolean = false;
  showDeleteAllConfirm: boolean = false;

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.getOrders();
    this.loadDeletedOrders();
  }

  // ════════════════════════════════════════════
  // LOAD DATA
  // ════════════════════════════════════════════
// ════════════════════════════════════════════
// PDF DOWNLOAD
// ════════════════════════════════════════════

downloadPdf(order: any): void {
  const id = order.id;
  this.httpService.downloadOrderPdf(id).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.showSuccess('PDF downloaded successfully!');
    },
    error: (err: any) => {
      console.error('PDF download failed:', err);
      this.showWarn('Could not download PDF. Please try again.');
    }
  });
}
  getOrders(): void {
    this.httpService.getorders().subscribe({
      next:  (data: any) => {
        // FIX: Ensure soft-deleted orders are never shown in the active list.
        // If the backend returns a `deleted` flag, filter them out defensively.
        this.orderList = (data || []).filter((o: any) => !o.deleted && !o.isDeleted);
      },
      error: () => { this.showWarn('Failed to load orders.'); }
    });
  }

  loadDeletedOrders(): void {
    this.httpService.getDeletedOrders().subscribe({
      next:  (data: any) => { this.deletedOrders = data || []; },
      error: () => { this.showWarn('Failed to load deleted orders.'); }
    });
  }

  // ════════════════════════════════════════════
  // FILTERED LIST
  // ════════════════════════════════════════════

  get filteredOrders(): any[] {
    if (!this.selectedStatus || this.selectedStatus === 'All') {
      return this.orderList;
    }
    return this.orderList.filter(o => o.status === this.selectedStatus);
  }

  // ════════════════════════════════════════════
  // STATUS FILTER
  // ════════════════════════════════════════════

  toggleFilterPanel(): void {
    this.showFilterPanel  = !this.showFilterPanel;
    this.showPaymentPanel = false;
  }

  applyFilter(status: string): void {
    this.selectedStatus  = status;
    this.showFilterPanel = false;
    // FIX: Clear selection when filter changes to avoid
    // acting on orders that are no longer visible.
    this.clearSelection();
  }

  clearFilter(): void {
    this.selectedStatus  = 'All';
    this.showFilterPanel = false;
    this.clearSelection();
  }

  // ════════════════════════════════════════════
  // PAYMENT FILTER
  // ════════════════════════════════════════════

  togglePaymentPanel(): void {
    this.showPaymentPanel = !this.showPaymentPanel;
    this.showFilterPanel  = false;
  }

  applyPaymentFilter(value: string): void {
    this.selectedPayment  = value;
    this.showPaymentPanel = false;
    this.clearSelection();
  }

  clearPaymentFilter(): void {
    this.selectedPayment  = 'All Payments';
    this.showPaymentPanel = false;
    this.clearSelection();
  }

  // ════════════════════════════════════════════
  // MODAL — EDIT / UPDATE STATUS
  // ════════════════════════════════════════════

  edit(order: any): void {
    this.orderObj              = { ...order }; // FIX: Clone to avoid mutating list directly
    this.statusModel.newStatus = order.status;
    this.pendingStatus         = order.status;
  }

  onNewStatusChange(newStatus: string): void {
    const currentIndex = this.getStatusIndex(this.orderObj?.status || 'Initiated');
    const newIndex     = this.getStatusIndex(newStatus);

    if (newIndex < currentIndex) {
      this.statusModel.newStatus = this.orderObj.status;
      this.pendingStatus         = this.orderObj.status; // FIX: Reset ambulance too
      this.showWarn('❌ Order cannot be changed to a previous state.');
      return;
    }

    // FIX: Update pendingStatus so the road tracker animates live on dropdown change
    this.pendingStatus = newStatus;
  }

  update(): void {
    const current  = this.orderObj?.status || 'Initiated';
    const selected = this.statusModel?.newStatus;

    if (!this.orderObj?.id || !selected) return;

    if (this.getStatusIndex(selected) < this.getStatusIndex(current)) {
      this.showWarn('❌ Order cannot be changed to a previous state.');
      return;
    }

    this.pendingStatus = selected;

    setTimeout(() => {
      this.httpService.UpdateOrderStatus(this.orderObj.id, selected).subscribe({
        next: () => {
          this.showSuccess('✅ Order status updated successfully!');
          this.orderObj = {};
          this.getOrders();
        },
        error: () => { this.showWarn('❌ Update failed. Please try again.'); }
      });
    }, 700);
  }

  // ════════════════════════════════════════════
  // DELETE (SOFT) — SINGLE
  // ════════════════════════════════════════════

  deleteOrder(orderId: number): void {
    this.httpService.deleteOrder(orderId).subscribe({
      next: (res: any) => {
        // Remove from local list only after confirmed success
        this.orderList = this.orderList.filter(o => o.id !== orderId);
        delete this.selectedMap[orderId];
        this.loadDeletedOrders();
        // res may be plain text string or object depending on backend
        
        this.showSuccess("Order deleted successfully");
      },
      error: (err) => {
        console.error('Delete order error:', err);
        this.showWarn('Delete failed: ' + (err?.error || err?.message || 'Unknown error'));
      }
    });
  }

  // ════════════════════════════════════════════
  // BULK SELECT
  // ════════════════════════════════════════════

  toggleSelect(orderId: number, event: Event): void {
    this.selectedMap = {
      ...this.selectedMap,
      [orderId]: (event.target as HTMLInputElement).checked
    };
  }

  selectAllVisible(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const updated: { [id: number]: boolean } = { ...this.selectedMap };
    this.filteredOrders.forEach(o => { updated[o.id] = checked; });
    this.selectedMap = updated;
  }

  get allVisibleSelected(): boolean {
    if (!this.filteredOrders.length) return false;
    return this.filteredOrders.every(o => this.selectedMap[o.id]);
  }

  get selectedIds(): number[] {
    return Object.keys(this.selectedMap)
      .filter(id => this.selectedMap[+id])
      .map(id => +id);
  }

  get selectedCount(): number {
    return this.selectedIds.length;
  }

  clearSelection(): void {
    this.selectedMap = {};
  }

  // ════════════════════════════════════════════
  // BULK DELETE
  // ════════════════════════════════════════════

  openBulkDeleteConfirm(): void {
    if (this.selectedCount === 0) return;
    this.showDeleteConfirm = true;
  }

  cancelBulkDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmBulkDelete(): void {
    const ids = this.selectedIds;
    if (!ids.length) return;

    // FIX: Optimistically remove selected orders from the local list immediately
    // so they vanish from the UI without waiting for the HTTP response + reload.
    this.orderList = this.orderList.filter(o => !ids.includes(o.id));
    this.showDeleteConfirm = false;
    this.clearSelection();

    this.httpService.deleteOrdersBulk(ids)
      .pipe(finalize(() => {
        // Sync both lists from server to ensure consistency
        this.getOrders();
        this.loadDeletedOrders();
      }))
      .subscribe({
        next: (res: any) => {
          this.showSuccess(res?.message || `${ids.length} order(s) moved to Deleted Orders`);
        },
        error: () => {
          // Rollback on failure
          this.getOrders();
          this.showWarn('Bulk delete failed');
        }
      });
  }

  // ════════════════════════════════════════════
  // DELETED ORDERS PANEL
  // ════════════════════════════════════════════

  toggleDeletedPanel(): void {
    this.showDeletedPanel = !this.showDeletedPanel;
    if (this.showDeletedPanel) { this.loadDeletedOrders(); }
  }

  restoreOrder(orderId: number): void {
    this.httpService.restoreOrder(orderId)
      .pipe(finalize(() => {
        this.getOrders();
        this.loadDeletedOrders();
      }))
      .subscribe({
        next:  (res: any) => { this.showSuccess(res?.message || `Order #${orderId} restored`); },
        error: () => { this.showWarn('Restore failed'); }
      });
  }

  permanentlyDelete(orderId: number): void {
    this.httpService.permanentDeleteOrder(orderId)
      .pipe(finalize(() => { this.loadDeletedOrders(); }))
      .subscribe({
        next:  (res: any) => { this.showSuccess(res?.message || `Order #${orderId} permanently deleted`); },
        error: () => { this.showWarn('Permanent delete failed'); }
      });
  }

  restoreAll(): void {
    if (!this.deletedOrders?.length) return;
    this.httpService.restoreAllDeletedOrders()
      .pipe(finalize(() => {
        this.getOrders();
        this.loadDeletedOrders();
      }))
      .subscribe({
        next:  (res: any) => { this.showSuccess(res?.message || 'All deleted orders restored'); },
        error: () => { this.showWarn('Restore All failed'); }
      });
  }

  openDeleteAllConfirm(): void {
    if (!this.deletedOrders?.length) return;
    this.showDeleteAllConfirm = true;
  }

  cancelDeleteAll(): void {
    this.showDeleteAllConfirm = false;
  }

  deleteAllPermanently(): void {
    this.httpService.deleteAllDeletedOrdersPermanently()
      .pipe(finalize(() => {
        this.loadDeletedOrders();
        this.showDeleteAllConfirm = false;
      }))
      .subscribe({
        next:  (res: any) => { this.showSuccess(res?.message || 'All deleted orders permanently removed'); },
        error: () => { this.showWarn('Delete All Permanently failed'); }
      });
  }

  // ════════════════════════════════════════════
  // TRACKER HELPERS
  // ════════════════════════════════════════════

  getStepIndex(status: string): number {
    return this.trackingSteps.indexOf(status);
  }

  getStatusIndex(status: string): number {
    const idx = this.statusFlow.indexOf(status);
    return idx === -1 ? 0 : idx;
  }

  getAmbulanceLeftPercent(status: string): number {
    const idx = this.trackingSteps.indexOf(status);
    if (idx < 0) return 0;
    return (idx / (this.trackingSteps.length - 1)) * 100;
  }

  getProgressPercent(status: string): number {
    return this.getAmbulanceLeftPercent(status);
  }

  getCardTrackIndex(status: string): number {
    const idx = this.cardTrackSteps.indexOf(status);
    return idx < 0 ? 0 : idx;
  }

  getCardAmbulanceTopPercent(status: string): number {
    const idx = this.getCardTrackIndex(status);
    return (idx / (this.cardTrackSteps.length - 1)) * 100;
  }

  getTrackFillPercent(status: string): number {
    const map: Record<string, number> = {
      'Initiated': 0,
      'Complete':  50,
      'Delivered': 100
    };
    return map[status] ?? 0;
  }

  getPackagePosition(status: string): string {
    const map: Record<string, string> = {
      'Initiated': '18px',
      'Complete':  '50%',
      'Delivered': 'calc(100% - 18px)'
    };
    return map[status] ?? '18px';
  }

  getCountByStatus(status: string): number {
    return this.orderList.filter(o => o.status === status).length;
  }

  isStepDone(orderStatus: string, stepIndex: number): boolean {
    const statusIndex = this.getStepIndex(orderStatus);
    if (stepIndex === this.trackingSteps.length - 1) {
      return statusIndex >= stepIndex;
    }
    return statusIndex > stepIndex;
  }

  isStepCurrent(orderStatus: string, stepIndex: number): boolean {
    if (stepIndex === this.trackingSteps.length - 1) return false;
    return this.getStepIndex(orderStatus) === stepIndex;
  }

  // ════════════════════════════════════════════
  // TOAST HELPERS
  // ════════════════════════════════════════════

  showSuccess(message: string): void {
    this.showMessage     = true;
    this.responseMessage = message;
    this.showError       = false;
    setTimeout(() => { this.showMessage = false; }, 2500);
  }

  showWarn(message: string): void {
    this.showError    = true;
    this.errorMessage = message;
    setTimeout(() => { this.showError = false; }, 2500);
  }

  signOut(): void {
    this.router.navigate(['/login']);
  }
}