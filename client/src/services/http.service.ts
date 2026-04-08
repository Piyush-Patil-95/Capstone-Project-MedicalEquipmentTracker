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

  constructor(private http: HttpClient, private authService: AuthService) { }

  // ── Auth headers (JSON + Bearer token) ───────────────────────────────────
  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      })
    };
  }

  // ── Auth headers for plain-text responses ─────────────────────────────────
  // FIX: Build explicitly instead of spreading getHttpOptions() + responseType,
  // because Angular's HttpClient does NOT merge spread overrides reliably —
  // the responseType field must sit at the top level of the options object.
  private getTextOptions(): { headers: HttpHeaders; responseType: 'text' } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }),
      responseType: 'text'   // ← top-level, NOT nested inside headers
    };
  }

  // ── Public headers (no token) ─────────────────────────────────────────────
  private getPublicOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  // ===================== CONTACT =====================
  sendContactMessage(data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/contact/send`,
      data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }

  // ===================== AUTH =====================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('hospital_profile_photo');
  }

  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, data);
  }

  // ===================== HOSPITAL =====================
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

  getMyHospital(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/hospital/my`,
      this.getHttpOptions()
    );
  }

  updateHospital(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/hospital/update/${id}`,
      data,
      this.getHttpOptions()
    );
  }

  deleteHospital(id: number): Observable<any> {
    // FIX: Use getTextOptions() instead of spreading responseType
    return this.http.delete(
      `${this.serverName}/api/hospital/${id}`,
      this.getTextOptions() as any
    );
  }

  // ===================== EQUIPMENT =====================
  addEquipment(data: any, hospitalId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}`,
      data,
      this.getHttpOptions()
    );
  }

  getEquipmentById(id: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/hospital/equipment/${id}`,
      this.getHttpOptions()
    );
  }

  // ===================== ORDERS =====================
  getorders(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/supplier/orders`,
      this.getHttpOptions()
    );
  }

  getorders1(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/supplier/orders`,
      this.getHttpOptions()
    );
  }

  getMyOrders(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/hospital/orders`,
      this.getHttpOptions()
    );
  }

  orderEquipment(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  UpdateOrderStatus(orderId: any, newStatus: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${newStatus}`,
      {},
      this.getHttpOptions()
    );
  }

  // FIX: Was using spread `{ ...this.getHttpOptions(), responseType: 'text' as 'json' }`
  // which silently fails in Angular because HttpClient reads responseType at the
  // options root level during request creation — a spread creates a plain object
  // where the type system accepts it but the runtime ignores the override.
  // Now using getTextOptions() which guarantees responseType is at root level.
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/supplier/order/delete/${id}`,
      this.getTextOptions() as any
    );
  }

  // ── Deleted Orders ────────────────────────────────────────────────────────
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

  // ── Bulk Delete ───────────────────────────────────────────────────────────
  deleteOrdersBulk(ids: number[]): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/supplier/orders/delete`,
      ids,
      this.getHttpOptions()
    );
  }

  // ===================== PDF =====================
  downloadOrderPdf(id: number): Observable<Blob> {
    const token = this.authService.getToken();
    return this.http.get(`${this.serverName}/api/pdf/order/${id}`, {
      headers: new HttpHeaders({
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Accept': 'application/pdf'
      }),
      responseType: 'blob'
    });
  }

  // ===================== MAINTENANCE =====================
  scheduleMaintenance(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  addMaintenance(data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/technician/maintenance/add`,
      data,
      this.getHttpOptions()
    );
  }

  getMaintenance(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/technician/maintenance`,
      this.getHttpOptions()
    );
  }

  deleteMaintenance(id: number): Observable<any> {
    // FIX: Same responseType spread issue — use getTextOptions()
    return this.http.delete(
      `${this.serverName}/api/technician/maintenance/${id}`,
      this.getTextOptions() as any
    );
  }

  updateMaintenance(data: any, id: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/technician/maintenance/update/${id}`,
      data,
      this.getTextOptions() as any
    );
  }

  markPaymentDone(data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/payment/complete`,
      data,
      this.getHttpOptions()
    );
  }

  // ===================== CAPTCHA =====================
  getCaptcha(): Observable<any> {
    return this.http.get(`${this.serverName}/api/captcha/generate`);
  }

  // ===================== OTP / PASSWORD =====================
  sendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/otp/send`,
      { email },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }

  forgotPasswordSendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/password/forgot`,
      { email },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }

  forgotPasswordVerifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/password/verify-otp`,
      { email, otp },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }
  // ===================== MAINTENANCE PDF =====================
downloadMaintenancePdf(id: number): Observable<Blob> {
  const token = this.authService.getToken();
  return this.http.get(`${this.serverName}/api/pdf/maintenance/${id}`, {
    headers: new HttpHeaders({
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Accept': 'application/pdf'
    }),
    responseType: 'blob'
  });
}

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/password/reset`,
      { email, otp, newPassword },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/otp/verify`,
      { email, otp },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    );
  }
}