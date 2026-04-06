
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  showError: boolean = false;
  errorMessage: any;
  showMessage: any;
  responseMessage: any;
  orderList: any = [];
  statusModel: any = { newStatus: null };
  orderObj: any = {};


  // ✅ Tracking steps (NO extra statuses)
  trackingSteps: string[] = ['Initiated', 'Complete', 'Delivered'];

  // ✅ Filter Button state
  showFilterPanel: boolean = false;

  // ✅ NEW: filter state
  selectedStatus: string = 'All';

  // ✅ NEW: dropdown values
  statusOptions: string[] = ['All', 'Initiated', 'Complete', 'Delivered'];


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getOrders();
    this.loadDeletedOrders();

  }

  getOrders(): void {
    this.httpService.getorders().subscribe({
      next: (data) => {
        this.orderList = data;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = "Failed to load orders.";
      }
    });
  }


  // ✅ NEW: returns filtered list based on selected status
  // get filteredOrders(): any[] {
  //   if (this.selectedStatus === 'All') {
  //     return this.orderList;
  //   }
  //   return this.orderList.filter((order: { status: string; }) => order.status === this.selectedStatus);
  // }

  // ✅ Optional: called when dropdown changes (if you want)
  onFilterChange(status: string) {
    this.selectedStatus = status;
  }


  // 2nd with updated payment
  get filteredOrders(): any[] {
  let list = [...this.orderList];

  // ✅ Existing status filter
  if (this.selectedStatus !== 'All') {
    list = list.filter(o => o.status === this.selectedStatus);
  }

  // ✅ Payment filter
  if (this.selectedPayment !== 'All Payments') {
    list = list.filter(o =>
      (o.paymentStatus || 'Unpaid').toLowerCase() === this.selectedPayment.toLowerCase()
    );
  }

  return list;
}

  


  // ✅ Toggle panel open/close
toggleFilterPanel(): void {
  this.showFilterPanel = !this.showFilterPanel;
  this.showPaymentPanel = false; // close payment panel
}


  // ✅ Apply selection + auto close panel
  applyFilter(status: string): void {
    this.selectedStatus = status;
    this.showFilterPanel = false;
  }

  // ✅ Reset to show all
  clearFilter(): void {
    this.selectedStatus = 'All';
    this.showFilterPanel = false;
  }


  // deleteOrder(id: number) {
  //   if (!confirm('Are you sure you want to delete this order?')) return;

  //   this.httpService.deleteOrder(id).subscribe({
  //     next: () => {
  //       // remove from UI instantly
  //       this.orderList = this.orderList.filter((o: any) => o.id !== id);
  //       alert('Order Deleted Successfully');
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       alert('Delete failed');
  //     }
  //   });
  // }


  viewDetails(details: any): void {
    this.orderObj = details;
  }
  pendingStatus: string = ''

  edit(order: any): void {
    this.orderObj = order;
    this.statusModel.newStatus = order.status;
    this.pendingStatus = order.status; // ambulance starts at current status
  }



  // ✅ Used by tracking UI
  getStepIndex(status: string): number {
    return this.trackingSteps.indexOf(status);
  }



  update(): void {
  const current = this.orderObj?.status || 'Initiated';
  const selected = this.statusModel?.newStatus;

  if (!this.orderObj?.id || !selected) return;

  const currentIndex = this.getStatusIndex(current);
  const newIndex = this.getStatusIndex(selected);

  // ❌ block reverse update (double-safety)
  if (newIndex < currentIndex) {
    this.statusModel.newStatus = current;
    this.showWarn('❌ Order cannot be changed to a previous state.');
    return;
  }

  // ✅ 1) Move ambulance to selected status (animation)
  this.pendingStatus = selected;

  // ✅ 2) After animation ends, update backend
  setTimeout(() => {
    this.httpService.UpdateOrderStatus(this.orderObj.id, selected).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = "✅ Order status updated successfully!";
        this.showError = false;

        // close modal
        this.orderObj = {};

        // refresh list
        this.getOrders();

        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        this.showWarn("❌ Update failed. Please try again.");
      }
    });
  }, 700); // ✅ must match ambulance transition duration
}


  // ===============================
  // ✅ Bulk Delete + Deleted Orders
  // ===============================
  selectedMap: { [id: number]: boolean } = {};     // which orders are selected
  showDeleteConfirm: boolean = false;              // confirm modal
  showDeletedPanel: boolean = false;               // trash panel

  deletedOrders: any[] = [];                       // trash list (saved in localStorage)
  // no need of this ---> private readonly DELETED_KEY = 'deletedOrders';  // storage key

  // ✅ on page load, restore deleted list
  loadDeletedOrders(): void {
  this.httpService.getDeletedOrders().subscribe({
    next: (data: any) => {
      this.deletedOrders = data;
    },
    error: (err: any) => {
      this.showError = true;
      this.errorMessage = "Failed to load deleted orders.";
    }
  });
}
//no need of below 
  // saveDeletedOrders(): void {
  //   localStorage.setItem(this.DELETED_KEY, JSON.stringify(this.deletedOrders));
  // }

  // ✅ helper: return selected IDs
  get selectedIds(): number[] {
    return Object.keys(this.selectedMap)
      .filter(id => this.selectedMap[+id])
      .map(id => +id);
  }

  // ✅ helper: how many selected (useful for UI)
  get selectedCount(): number {
    return this.selectedIds.length;
  }

  // ✅ Select / Unselect one order

  toggleSelect(orderId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedMap[orderId] = checked;
  }


  // ✅ Select all currently visible (filtered) orders

  selectAllVisible(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.filteredOrders.forEach(o => {
      this.selectedMap[o.id] = checked;
    });
  }


  // ✅ Are all visible selected?
  get allVisibleSelected(): boolean {
    if (!this.filteredOrders.length) return false;
    return this.filteredOrders.every(o => this.selectedMap[o.id]);
  }

  // ✅ Clear selections
  clearSelection(): void {
    this.selectedMap = {};
  }

  // ✅ Open confirm modal
  openBulkDeleteConfirm(): void {
    if (this.selectedCount === 0) return;
    this.showDeleteConfirm = true;
  }

  // ✅ Cancel confirm modal
  cancelBulkDelete(): void {
    this.showDeleteConfirm = false;
  }

  // ✅ Bulk delete action
  confirmBulkDelete(): void {
  const idsToDelete = this.selectedIds;
  if (!idsToDelete.length) return;

  this.httpService.deleteOrdersBulk(idsToDelete)
    .pipe(finalize(() => {
      // ✅ refresh both lists ALWAYS
      this.getOrders();
      this.loadDeletedOrders();
    }))
    .subscribe({
      next: (res: any) => {
        this.showDeleteConfirm = false;
        this.clearSelection();

        this.showMessage = true;
        this.responseMessage = res?.message || `${idsToDelete.length} order(s) moved to Deleted Orders`;
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = "Bulk delete failed";
        setTimeout(() => this.showError = false, 2500);
      }
    });
}

  // ✅ Single delete (your existing delete button can call this)


deleteOrder(orderId: number): void {
  this.httpService.deleteOrder(orderId)
    .pipe(finalize(() => {
      // ✅ refresh both lists ALWAYS (panel open or not)
      this.getOrders();
      this.loadDeletedOrders();
    }))
    .subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = res?.message || `Order #${orderId} moved to Deleted Orders`;
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = 'Delete failed';
        setTimeout(() => this.showError = false, 2500);
      }
    });
}



  // ✅ Open/close trash panel
  toggleDeletedPanel(): void {
  this.showDeletedPanel = !this.showDeletedPanel;

  // ✅ whenever panel opens, fetch latest deleted orders
  if (this.showDeletedPanel) {
    this.loadDeletedOrders();
  }
}

  // ✅ Restore from trash
restoreOrder(orderId: number): void {
  this.httpService.restoreOrder(orderId)
    .pipe(finalize(() => {
      // ✅ refresh both lists ALWAYS
      this.getOrders();
      this.loadDeletedOrders();
    }))
    .subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = res?.message || `Order #${orderId} restored`;
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = "Restore failed";
        setTimeout(() => this.showError = false, 2500);
      }
    });
}



  // ✅ Permanently remove from trash
permanentlyDelete(orderId: number): void {
  this.httpService.permanentDeleteOrder(orderId)
    .pipe(finalize(() => {
      // ✅ refresh deleted list ALWAYS
      this.loadDeletedOrders();
    }))
    .subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = res?.message || `Order #${orderId} permanently deleted`;
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = "Permanent delete failed";
        setTimeout(() => this.showError = false, 2500);
      }
    });
}

  // trackingSteps: string[] = ['Initiated', 'Complete', 'Delivered'];

  // ambulance position on road (0%, 50%, 100%)
  getAmbulanceLeftPercent(status: string): number {
    const idx = this.trackingSteps.indexOf(status);
    if (idx < 0) return 0;
    return (idx / (this.trackingSteps.length - 1)) * 100;
  }

  // progress line width (till current step)
  getProgressPercent(status: string): number {
    return this.getAmbulanceLeftPercent(status);
  }
  // ✅ Payment Filter
  showPaymentPanel: boolean = false;
  selectedPayment: string = 'All Payments';
  paymentOptions: string[] = ['All Payments', 'Paid', 'Unpaid'];

  togglePaymentPanel(): void {
    this.showPaymentPanel = !this.showPaymentPanel;
  }

  applyPaymentFilter(value: string): void {
    this.selectedPayment = value;
    this.showPaymentPanel = false;
    this.clearSelection?.(); // if bulk selection exists
  }

  clearPaymentFilter(): void {
    this.selectedPayment = 'All Payments';
    this.showPaymentPanel = false;
    this.clearSelection?.();
  }

 // ✅ Forward-only status order
statusFlow: string[] = ['Initiated', 'Complete', 'Delivered'];

// Convert status to index for comparison
getStatusIndex(status: string): number {
  const idx = this.statusFlow.indexOf(status);
  return idx === -1 ? 0 : idx;
}

// Popup helper (uses your existing toast system)
showWarn(message: string) {
  this.showError = true;
  this.errorMessage = message;
  setTimeout(() => this.showError = false, 2500);
}

onNewStatusChange(newStatus: string): void {
  const current = this.orderObj?.status || 'Initiated';

  const currentIndex = this.getStatusIndex(current);
  const newIndex = this.getStatusIndex(newStatus);

  // ❌ Prevent moving backward
  if (newIndex < currentIndex) {
    // revert dropdown selection back to current
    this.statusModel.newStatus = current;

    // show popup message
    this.showWarn('❌ Order cannot be changed to a previous state.');

    return;
  }

  // ✅ Allow forward selection (do NOT move ambulance here)
  // Ambulance should move only on Submit Update (your requirement)
}
// ✅ For vertical tracker on each card
cardTrackSteps: string[] = ['Initiated', 'Complete', 'Delivered'];

getCardTrackIndex(status: string): number {
  const idx = this.cardTrackSteps.indexOf(status);
  return idx < 0 ? 0 : idx;
}

// Ambulance vertical position (0% top, 50% middle, 100% bottom)
getCardAmbulanceTopPercent(status: string): number {
  const idx = this.getCardTrackIndex(status);
  return (idx / (this.cardTrackSteps.length - 1)) * 100;
}

restoreAll(): void {
  if (!this.deletedOrders?.length) return;

  this.showError = false;
  this.errorMessage = '';

  this.httpService.restoreAllDeletedOrders()
    .pipe(finalize(() => {
      // refresh both lists
      this.getOrders();
      this.loadDeletedOrders();
    }))
    .subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = res?.message || 'All deleted orders restored';
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = 'Restore All failed';
        setTimeout(() => this.showError = false, 2500);
      }
    });
}

showDeleteAllConfirm: boolean = false;

openDeleteAllConfirm(): void {
  if (!this.deletedOrders?.length) return;
  this.showDeleteAllConfirm = true;
}

cancelDeleteAll(): void {
  this.showDeleteAllConfirm = false;
}

deleteAllPermanently(): void {
  this.showError = false;
  this.errorMessage = '';

  this.httpService.deleteAllDeletedOrdersPermanently()
    .pipe(finalize(() => {
      // refresh deleted list immediately
      this.loadDeletedOrders();
      this.showDeleteAllConfirm = false;
    }))
    .subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = res?.message || 'All deleted orders permanently removed';
        setTimeout(() => this.showMessage = false, 2500);
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = 'Delete All Permanently failed';
        setTimeout(() => this.showError = false, 2500);
      }
    });
}



}