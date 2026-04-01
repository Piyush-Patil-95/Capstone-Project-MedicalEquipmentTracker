
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