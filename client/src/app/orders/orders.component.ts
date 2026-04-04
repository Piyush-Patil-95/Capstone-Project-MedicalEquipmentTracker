
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { scheduled } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent  {

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


  constructor(private httpService: HttpService) {}

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
  get filteredOrders(): any[] {
    if (this.selectedStatus === 'All') {
      return this.orderList;
    }
    return this.orderList.filter((order: { status: string; }) => order.status === this.selectedStatus);
  }

  // ✅ Optional: called when dropdown changes (if you want)
  onFilterChange(status: string) {
    this.selectedStatus = status;
  }

  
// ✅ Toggle panel open/close
toggleFilterPanel(): void {
  this.showFilterPanel = !this.showFilterPanel;
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

  edit(order: any): void {
    this.orderObj = order;
   
    this.statusModel.newStatus = order.status;
  }

  
  // ✅ Used by tracking UI
  getStepIndex(status: string): number {
    return this.trackingSteps.indexOf(status);
  }


  update(): void {
    if (this.statusModel.newStatus && this.orderObj.id) {
      this.httpService.UpdateOrderStatus(this.orderObj.id,this.statusModel.newStatus).subscribe({
        next: (res) => {
          this.showMessage = true;
          this.responseMessage = "Order status updated successfully!";
          this.getOrders(); 
          this.orderObj = {}; 
          setTimeout(() => this.showMessage = false, 3000);
        },
        error: (err) => {
          this.showError = true;
          this.errorMessage = "Update failed.";
        }
      });
    }
}

// ===============================
// ✅ Bulk Delete + Deleted Orders
// ===============================
selectedMap: { [id: number]: boolean } = {};     // which orders are selected
showDeleteConfirm: boolean = false;              // confirm modal
showDeletedPanel: boolean = false;               // trash panel

deletedOrders: any[] = [];                       // trash list (saved in localStorage)
private readonly DELETED_KEY = 'deletedOrders';  // storage key

// ✅ on page load, restore deleted list
loadDeletedOrders(): void {
  const raw = localStorage.getItem(this.DELETED_KEY);
  this.deletedOrders = raw ? JSON.parse(raw) : [];
}

saveDeletedOrders(): void {
  localStorage.setItem(this.DELETED_KEY, JSON.stringify(this.deletedOrders));
}

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
  if (idsToDelete.length === 0) return;

  // 1) Move selected orders to Deleted Orders (Trash)
  const toTrash = this.orderList.filter((o: { id: number; }) => idsToDelete.includes(o.id));

  // avoid duplicates in trash
  toTrash.forEach((o: { id: any; }) => {
    const exists = this.deletedOrders.some(d => d.id === o.id);
    if (!exists) this.deletedOrders.unshift({ ...o, deletedAt: new Date().toISOString() });
  });
  this.saveDeletedOrders();

  // 2) Remove from active list (UI)
  this.orderList = this.orderList.filter((o: { id: number; }) => !idsToDelete.includes(o.id));

  // 3) Reset UI states
  this.clearSelection();
  this.showDeleteConfirm = false;

  // 4) Show success toast
  this.showMessage = true;
  this.responseMessage = `${idsToDelete.length} order(s) deleted successfully`;
  setTimeout(() => this.showMessage = false, 2500);

  // ✅ OPTIONAL: If you have backend DELETE API, call it here
  // idsToDelete.forEach(id => this.httpService.deleteOrder(id).subscribe());
}

// ✅ Single delete (your existing delete button can call this)
deleteOrder(orderId: number): void {
  // Move one order to trash
  const order = this.orderList.find((o: { id: number; }) => o.id === orderId);
  if (order) {
    const exists = this.deletedOrders.some(d => d.id === orderId);
    if (!exists) this.deletedOrders.unshift({ ...order, deletedAt: new Date().toISOString() });
    this.saveDeletedOrders();
  }

  // Remove from active list
  this.orderList = this.orderList.filter((o: { id: number; }) => o.id !== orderId);

  this.showMessage = true;
  this.responseMessage = `Order #${orderId} deleted`;
  setTimeout(() => this.showMessage = false, 2000);

  // OPTIONAL backend delete
  // this.httpService.deleteOrder(orderId).subscribe();
}

// ✅ Open/close trash panel
toggleDeletedPanel(): void {
  this.showDeletedPanel = !this.showDeletedPanel;
}

// ✅ Restore from trash
restoreOrder(orderId: number): void {
  const idx = this.deletedOrders.findIndex(d => d.id === orderId);
  if (idx === -1) return;

  const restored = this.deletedOrders[idx];
  this.deletedOrders.splice(idx, 1);
  this.saveDeletedOrders();

  // Put back in active list (top)
  this.orderList.unshift(restored);

  this.showMessage = true;
  this.responseMessage = `Order #${orderId} restored`;
  setTimeout(() => this.showMessage = false, 2000);
}

// ✅ Permanently remove from trash
permanentlyDelete(orderId: number): void {
  this.deletedOrders = this.deletedOrders.filter(d => d.id !== orderId);
  this.saveDeletedOrders();

  this.showMessage = true;
  this.responseMessage = `Order #${orderId} removed permanently`;
  setTimeout(() => this.showMessage = false, 2000);
}

 
}