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

  constructor(private http: HttpClient, private authService: AuthService) {}

  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }

  
  Login(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/register`, data);
  }

  
  addEquipment(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/equipment`, data, this.getHttpOptions());
  }

  getEquipmentById(id: any): Observable<any> {
    return this.http.get(`${this.serverName}/equipment/${id}`, this.getHttpOptions());
  }

  orderEquipment(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/orders`, data, this.getHttpOptions());
  }

  getorders(): Observable<any> {
    return this.http.get(`${this.serverName}/orders`, this.getHttpOptions());
  }

  UpdateOrderStatus(orderId: any, status: any): Observable<any> {
    return this.http.put(`${this.serverName}/orders/${orderId}`, { status }, this.getHttpOptions());
  }


  scheduleMaintenance(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/maintenance`, data, this.getHttpOptions());
  }

  getMaintenance(): Observable<any> {
    return this.http.get(`${this.serverName}/maintenance`, this.getHttpOptions());
  }

  updateMaintenance(id: any, data: any): Observable<any> {
    return this.http.put(`${this.serverName}/maintenance/${id}`, data, this.getHttpOptions());
  }

 
  createHospital(data: any): Observable<any> {
    return this.http.post(`${this.serverName}/hospitals`, data, this.getHttpOptions());
  }

  getHospital(): Observable<any> {
    return this.http.get(`${this.serverName}/hospitals`, this.getHttpOptions());
  }
}
