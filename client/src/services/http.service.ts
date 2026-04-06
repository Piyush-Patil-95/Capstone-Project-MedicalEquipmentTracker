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

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }

  // ============================================================
  // LOGIN API
  // ============================================================
  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, data);
  }

  // ============================================================
  // REGISTER API (Step 1: send OTP to email)
  // ============================================================
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, data);
  }

  // ============================================================
  // VERIFY OTP (Step 2)
  // ============================================================
  // verifyEmailOtp(email: string, otp: string): Observable<any> {
  //   return this.http.post(
  //     `${this.serverName}/api/user/verify-otp?email=${email}&otp=${otp}`,
  //     {}
  //   );
  // }

  verifyEmailOtp(data: any): Observable<any> {
  return this.http.post(
    `${this.serverName}/api/user/verify-otp`,
    data
  );
}

  // ============================================================
  // OPTIONAL → RESEND OTP (if needed)
  // ============================================================
  resendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/user/resend-otp?email=${email}`,
      {}
    );
  }

  // ============================================================
  // REMAINING EXISTING API METHODS
  // ============================================================
  deleteHospital(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/hospital/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'
      }
    );
  }

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

  orderEquipment(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  getorders(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/supplier/orders`,
      this.getHttpOptions()
    );
  }

  UpdateOrderStatus(status: any, orderId: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${status}`,
      {},
      this.getHttpOptions()
    );
  }

  scheduleMaintenance(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`,
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
    return this.http.delete(
      `${this.serverName}/api/technician/maintenance/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'
      }
    );
  }

  updateMaintenance(data: any, id: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/technician/maintenance/update/${id}`,
      data,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'
      }
    );
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/supplier/order/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'
      }
    );
  }

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

  // ============================================================
  // CAPTCHA
  // ============================================================
  getCaptcha(): Observable<any> {
    return this.http.get(`${this.serverName}/api/captcha/generate`);
  }

}