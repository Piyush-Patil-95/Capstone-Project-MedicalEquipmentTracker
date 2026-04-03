import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
selector: 'app-orders',
templateUrl: './orders.component.html',
styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

showError: boolean = false;
errorMessage: any;
showMessage: any;
responseMessage: any;
orderList: any = [];
statusModel: any = { newStatus: null };
orderObj: any = {};

constructor(private httpService: HttpService, private auth: AuthService) {}

ngOnInit() {
this.getOrders();
}

getOrders() {
const supplierId = this.auth.getUserId();


this.httpService.getorders(supplierId).subscribe({
  next: (data) => {
    this.orderList = data;
  },
  error: () => {
    this.orderList = [];
  }
});


}

deleteOrder(id: number) {
if (!confirm('Are you sure you want to delete this order?')) return;


this.httpService.deleteOrder(id).subscribe({
  next: () => {
    this.orderList = this.orderList.filter((o: any) => o.id !== id);
    alert('Order Deleted Successfully');
  },
  error: () => {
    alert('Delete failed');
  }
});


}

viewDetails(details: any): void {
this.orderObj = details;
}

edit(order: any): void {
this.orderObj = order;
this.statusModel.newStatus = order.status;
}

update(): void {
if (this.statusModel.newStatus && this.orderObj.id) {
this.httpService.UpdateOrderStatus(this.statusModel.newStatus, this.orderObj.id).subscribe({
next: () => {
this.showMessage = true;
this.responseMessage = "Order status updated successfully!";
this.getOrders();
this.orderObj = {};
setTimeout(() => this.showMessage = false, 3000);
},
error: () => {
this.showError = true;
this.errorMessage = "Update failed.";
}
});
}
}

}
