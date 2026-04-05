
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

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.httpService.getorders1().subscribe({
      next: (data) => {
        this.orderList = data;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = "Failed to load orders.";
      }
    });
  }
 downloadPDF(id: number) {
  console.log("📄 Downloading PDF for order ID:", id);

  this.httpService.downloadOrderPdf(id).subscribe({
    next: (blob: Blob) => {
      console.log("✅ Blob type:", blob.type, "size:", blob.size);

      if (!blob || blob.size === 0) {
        alert("❌ Empty PDF received");
        return;
      }

      // If backend returned JSON error as blob
      if (blob.type && blob.type.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error("❌ Backend returned JSON instead of PDF:", reader.result);
          alert("❌ Backend returned error JSON instead of PDF. Check console.");
        };
        reader.readAsText(blob);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error("❌ PDF Download Error:", err);
      alert(`❌ Download failed (Status: ${err.status})`);
    }
  });
}

  deleteOrder(id: number) {
  if (!confirm('Are you sure you want to delete this order?')) return;

  this.httpService.deleteOrder(id).subscribe({
    next: () => {
      // remove from UI instantly
      this.orderList = this.orderList.filter((o: any) => o.id !== id);
      alert('Order Deleted Successfully');
    },
    error: (err) => {
      console.error(err);
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

 
}