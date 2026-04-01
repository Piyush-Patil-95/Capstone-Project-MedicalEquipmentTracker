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

  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, data);
  }

  // :white_check_mark: FIXED
  addEquipment(data: any, hospitalId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}`,
      data,
      this.getHttpOptions()
    );
  }

  getEquipmentById(id: any): Observable<any> {
    return this.http.get(`${this.serverName}/api/hospital/equipment/${id}`, this.getHttpOptions());
  }

  // :white_check_mark: FIXED
  orderEquipment(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  // :white_check_mark: FIXED
  getorders(): Observable<any> {
    return this.http.get(`${this.serverName}/api/supplier/orders`, this.getHttpOptions());
  }

  
  UpdateOrderStatus( status: any,orderId: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${status}`,
      {},
      this.getHttpOptions()
    );
  }

  // :white_check_mark: FIXED
  scheduleMaintenance(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/maintenance/schedule?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

  // :white_check_mark: FIXED
  getMaintenance(): Observable<any> {
    return this.http.get(`${this.serverName}/api/technician/maintenance`, this.getHttpOptions());
  }

  // :white_check_mark: FIXED (IMPORTANT BUG HERE)
  updateMaintenance(data: any,id: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/technician/maintenance/update/${id}`,
      data,
      this.getHttpOptions()
    );
  }

  // :white_check_mark: FIXED
  createHospital(data: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/create`,
      data,
      this.getHttpOptions()
    );
  }

  // :white_check_mark: FIXED
  getHospital(): Observable<any> {
    return this.http.get(`${this.serverName}/api/hospitals`, this.getHttpOptions());
  }
}