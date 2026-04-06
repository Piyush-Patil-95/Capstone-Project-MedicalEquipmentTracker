import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.auth.getToken()}`
      })
    };
  }

  // AUTH
  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, data);
  }

  // HOSPITAL
  createHospital(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/hospital/create`, data, this.getHttpOptions());
  }

  getHospital(): Observable<any> {
    return this.http.get(`${this.serverName}/api/hospitals`, this.getHttpOptions());
  }

  // EQUIPMENT
  addEquipment(hospitalId: any, data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}`, data, this.getHttpOptions());
  }

  getEquipmentById(hospitalId: any): Observable<any> {
    return this.http.get(`${this.serverName}/api/hospital/equipment/${hospitalId}`, this.getHttpOptions());
  }

  // ORDERS (Supplier side)
  getorders(): Observable<any> {
    return this.http.get(`${this.serverName}/api/supplier/orders`, this.getHttpOptions());
  }

  // ✅ IMPORTANT: signature = (orderId, newStatus)
  UpdateOrderStatus(orderId: any, newStatus: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${newStatus}`,
      {},
      this.getHttpOptions()
    );
  }

  // MAINTENANCE
  getMaintenance(): Observable<any> {
    return this.http.get(`${this.serverName}/api/technician/maintenance`, this.getHttpOptions());
  }

  updateMaintenance(maintenanceId: any, data: any): Observable<any> {
    return this.http.put(`${this.serverName}/api/technician/maintenance/update/${maintenanceId}`, data, this.getHttpOptions());
  }

  scheduleMaintenance(equipmentId: any, data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`, data, this.getHttpOptions());
  }

  orderEquipment(equipmentId: any, data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`, data, this.getHttpOptions());
  }

  // ============================
  // ✅ SOFT DELETE APIs (Option B)
  // ============================

  deleteOrder(orderId: number) {
  return this.http.delete(
    `${this.serverName}/api/supplier/order/delete/${orderId}`,
    this.getHttpOptions()
  );
}


  deleteOrdersBulk(ids: number[]): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/supplier/orders/delete`,
      ids,
      this.getHttpOptions()
    );
  }

  getDeletedOrders(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/supplier/orders/deleted`,
      this.getHttpOptions()
    );
  }

  restoreOrder(orderId: number): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/restore/${orderId}`,
      {},
      this.getHttpOptions()
    );
  }

  permanentDeleteOrder(orderId: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/supplier/order/permanent/${orderId}`,
      this.getHttpOptions()
    );
  }
  // ✅ CAPTCHA (Login page)
getCaptcha(): Observable<any> {
  return this.http.get(`${this.serverName}/api/captcha/generate`);
}

// ✅ DELETE HOSPITAL (Admin/Hospital module)
deleteHospital(id: number): Observable<any> {
  return this.http.delete(
    `${this.serverName}/api/hospital/delete/${id}`,
    this.getHttpOptions()
  );
}

// ✅ DELETE MAINTENANCE (Technician module)
deleteMaintenance(id: number): Observable<any> {
  return this.http.delete(
    `${this.serverName}/api/technician/maintenance/delete/${id}`,
    this.getHttpOptions()
  );
}
}