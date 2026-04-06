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

  // ============================
  // AUTH
  // ============================
  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, data);
  }

  // ============================
  // CAPTCHA (Public)
  // ============================
  getCaptcha(): Observable<any> {
    return this.http.get(`${this.serverName}/api/captcha/generate`);
  }

  // ============================
  // HOSPITAL
  // ============================
  createHospital(data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/create`,
      data,
      this.getHttpOptions()
    );
  }

  getHospital(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/hospitals`,
      this.getHttpOptions()
    );
  }

  // ✅ FIX: backend endpoint is DELETE /api/hospital/{id}
  deleteHospital(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/hospital/${id}`,
      this.getHttpOptions()
    );
  }

  // ============================
  // EQUIPMENT
  // ============================
  addEquipment(hospitalId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}`,
      data,
      this.getHttpOptions()
    );
  }

  getEquipmentById(hospitalId: number): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/hospital/equipment/${hospitalId}`,
      this.getHttpOptions()
    );
  }

  // ============================
  // MAINTENANCE
  // ============================
  getMaintenance(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/technician/maintenance`,
      this.getHttpOptions()
    );
  }

  updateMaintenance(maintenanceId: number, data: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/technician/maintenance/update/${maintenanceId}`,
      data,
      this.getHttpOptions()
    );
  }

  // ✅ FIX: backend endpoint is DELETE /api/technician/maintenance/{id}
  deleteMaintenance(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/technician/maintenance/${id}`,
      this.getHttpOptions()
    );
  }

  scheduleMaintenance(equipmentId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  // ============================
  // ORDERS (Hospital side)
  // ============================
  // ✅ FIX: types + correct payload variable
  orderEquipment(equipmentId: number, payload: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
      payload,
      this.getHttpOptions()
    );
  }

  // ============================
  // ORDERS (Supplier side)
  // ============================
  getorders(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/supplier/orders`,
      this.getHttpOptions()
    );
  }

  // ✅ IMPORTANT: signature = (orderId, newStatus)
  UpdateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${newStatus}`,
      {},
      this.getHttpOptions()
    );
  }

  // ============================
  // ✅ SOFT DELETE APIs (Option B)
  // ============================
  deleteOrder(orderId: number): Observable<any> {
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
  restoreAllDeletedOrders(): Observable<any> {
  return this.http.put(
    `${this.serverName}/api/supplier/orders/restoreAll`,
    {},
    this.getHttpOptions()
  );
}
deleteAllDeletedOrdersPermanently(): Observable<any> {
  return this.http.delete(
    `${this.serverName}/api/supplier/orders/deleted/deleteAll`,
    this.getHttpOptions()
  );
}


}