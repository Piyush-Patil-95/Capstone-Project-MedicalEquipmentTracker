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


  // ✅ Reusable headers (with safe token)
  private getHttpOptions() {
    const token = this.authService.getToken();
    console.log("🔥 TOKEN:", token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      })
    };
  }
  getMyHospital(): Observable<any> {
  return this.http.get(
    `${this.serverName}/api/hospital/my`,
    this.getHttpOptions()
  );
}
  // ===================== AUTH =====================
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

  deleteHospital(id: number): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/hospital/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'
      }
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

  // ===================== ORDER =====================
  orderEquipment(data: any, equipmentId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/hospital/order?equipmentId=${equipmentId}`,
      data,
      this.getHttpOptions()
    );
  }

 getorders1(): Observable<any> {
  return this.http.get(
    `${this.serverName}/api/supplier/orders`,
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
getorders() {
  return this.http.get(`${this.serverName}/api/hospital/orders`, this.getHttpOptions());
}

  UpdateOrderStatus(status: any, orderId: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/supplier/order/update/${orderId}?newStatus=${status}`,
      {},
      this.getHttpOptions()
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

  // ✅ PDF DOWNLOAD (BLOB)
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

  // getMaintenance(): Observable<any> {
  //   return this.http.get(
  //     `${this.serverName}/api/technician/maintenance`,
  //     this.getHttpOptions()
  //   );
  // }

  getMaintenance() {
  return this.http.get(`${this.serverName}/api/hospital/maintenance`, this.getHttpOptions());
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
 markPaymentDone(data: any): Observable<any> {
  return this.http.post(
    `${this.serverName}/api/hospital/payment/complete`,
    data,
    this.getHttpOptions()
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

  // ===================== CAPTCHA =====================
  getCaptcha(): Observable<any> {
    return this.http.get(`${this.serverName}/api/captcha/generate`);
  }

}